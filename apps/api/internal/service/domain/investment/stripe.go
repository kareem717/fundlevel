package investment

import (
	"context"
	"fmt"
	"slices"
	"strconv"
	"time"

	"fundlevel/internal/entities/investment"
	"fundlevel/internal/storage"

	"github.com/stripe/stripe-go/v81"
	"github.com/stripe/stripe-go/v81/paymentintent"
)

const (
	InvestmentIDMetadataKey        = "investment_id"
	InvestmentPaymentIDMetadatakey = "investment_payment_id"
)

func (s *InvestmentService) HandleStripePaymentIntentFailed(ctx context.Context, intentID string) error {
	stripe.Key = s.stripeAPIKey

	intent, err := paymentintent.Get(intentID, nil)
	if err != nil {
		return err
	}

	investmentId, ok := intent.Metadata[InvestmentIDMetadataKey]
	if !ok {
		return fmt.Errorf("investment ID not found in session metadata")
	}

	parsedInvestmentId, err := strconv.Atoi(investmentId)
	if err != nil {
		return fmt.Errorf("failed to convert investment ID to int: %w", err)
	}

	failedPaymentCount, err := s.repositories.Investment().GetFailedPaymentCount(ctx, parsedInvestmentId)
	if err != nil {
		return err
	}

	//todo: O(n) is not ideal, but i think its faster than a map due to small n
	// If the payment intent was cancelled due to a serious reason or we've tried too many times,
	// we need to mark the investment as failed
	if failedPaymentCount >= 4 || !slices.Contains([]stripe.PaymentIntentCancellationReason{
		stripe.PaymentIntentCancellationReasonFailedInvoice,
		stripe.PaymentIntentCancellationReasonAbandoned,
		stripe.PaymentIntentCancellationReasonVoidInvoice,
		stripe.PaymentIntentCancellationReasonAutomatic,
	}, intent.CancellationReason) {
		return nil
	}

	investmentRecord, err := s.repositories.Investment().GetById(ctx, parsedInvestmentId)
	if err != nil {
		return err
	}

	// Otherwise, we lets let them try paying again
	err = s.repositories.RunInTx(ctx, func(ctx context.Context, tx storage.Transaction) error {
		intent, err = s.createStripePaymentIntent(parsedInvestmentId, investmentRecord.UsdCentValue)
		if err != nil {
			return err
		}

		_, err = tx.Investment().CreatePayment(ctx, investmentRecord.ID, investment.CreatePaymentParams{
			StripePaymentIntentID:           intent.ID,
			StripePaymentIntentClientSecret: intent.ClientSecret,
			Status:                          intent.Status,
			TotalUsdCents:                   intent.Amount,
		})

		return err
	})
	if err != nil {
		return err
	}

	return nil
}

func (s *InvestmentService) HandleStripePaymentIntentSucceeded(ctx context.Context, intentID string) error {
	stripe.Key = s.stripeAPIKey

	intent, err := paymentintent.Get(intentID, nil)
	if err != nil {
		return err
	}

	investmentId, ok := intent.Metadata[InvestmentIDMetadataKey]
	if !ok {
		return fmt.Errorf("investment ID not found in session metadata")
	}

	parsedInvestmentId, err := strconv.Atoi(investmentId)
	if err != nil {
		return fmt.Errorf("failed to convert investment ID to int: %w", err)
	}

	return s.repositories.RunInTx(ctx, func(ctx context.Context, tx storage.Transaction) error {
		_, err := tx.Investment().UpdatePayment(ctx, parsedInvestmentId, investment.UpdatePaymentParams{
			Status: &intent.Status,
		})
		if err != nil {
			return err
		}

		now := time.Now()
		_, err = tx.Investment().Update(ctx, parsedInvestmentId, investment.UpdateInvestmentParams{
			CompletedAt: &now,
		})

		if err != nil {
			return err
		}

		return nil
	})
}

func (s *InvestmentService) HandleStripePaymentIntentStatusUpdated(ctx context.Context, intentID string) error {
	stripe.Key = s.stripeAPIKey

	intent, err := paymentintent.Get(intentID, nil)
	if err != nil {
		return err
	}

	//TODO: consider turning into a map for constant time lookup
	if intent.Status != stripe.PaymentIntentStatusRequiresAction &&
		intent.Status != stripe.PaymentIntentStatusProcessing &&
		intent.Status != stripe.PaymentIntentStatusRequiresCapture &&
		intent.Status != stripe.PaymentIntentStatusRequiresPaymentMethod &&
		intent.Status != stripe.PaymentIntentStatusRequiresConfirmation {
		return fmt.Errorf("investment payment intent status is not in a valid state to update: %s", intent.Status)
	}

	paymentId, ok := intent.Metadata[InvestmentPaymentIDMetadatakey]
	if !ok {
		return fmt.Errorf("investment payment ID not found in session metadata")
	}

	parsedPaymentId, err := strconv.Atoi(paymentId)
	if err != nil {
		return fmt.Errorf("failed to convert investment payment ID to int: %w", err)
	}

	paymentRecord, err := s.repositories.Investment().GetPaymentById(ctx, parsedPaymentId)
	if err != nil {
		return fmt.Errorf("failed to get investment payment: %w", err)
	}

	_, err = s.repositories.Investment().UpdatePayment(ctx, paymentRecord.ID, investment.UpdatePaymentParams{
		Status: &intent.Status,
	})

	return err
}

func (s *InvestmentService) createStripePaymentIntent(investmentId int, subTotalUsdCents int64) (*stripe.PaymentIntent, error) {
	//TODO: how can we make this not hard coded?
	feeCents := float64(subTotalUsdCents) * s.feePercentage

	totalAmount := float64(subTotalUsdCents) + feeCents

	stripe.Key = s.stripeAPIKey

	paymentIntentParams := &stripe.PaymentIntentParams{
		Amount: stripe.Int64(int64(totalAmount)),
		// TODO: make this dynamic
		Currency:             stripe.String(string(stripe.CurrencyUSD)),
		PaymentMethodTypes: []*string{
			stripe.String(string(stripe.PaymentMethodTypeCard)),
			stripe.String(string(stripe.PaymentMethodTypeACSSDebit)),
			stripe.String(string(stripe.PaymentMethodTypeUSBankAccount)),
		},
		PaymentMethodOptions: &stripe.PaymentIntentPaymentMethodOptionsParams{
			ACSSDebit: &stripe.PaymentIntentPaymentMethodOptionsACSSDebitParams{
				MandateOptions: &stripe.PaymentIntentPaymentMethodOptionsACSSDebitMandateOptionsParams{
					PaymentSchedule: stripe.String(string(stripe.PaymentIntentPaymentMethodOptionsACSSDebitMandateOptionsPaymentScheduleSporadic)),
					TransactionType: stripe.String(string(stripe.PaymentIntentPaymentMethodOptionsACSSDebitMandateOptionsTransactionTypePersonal)),
				},
			},
		},
		Metadata: map[string]string{
			InvestmentIDMetadataKey: strconv.Itoa(investmentId),
		},
	}

	return paymentintent.New(paymentIntentParams)
}
