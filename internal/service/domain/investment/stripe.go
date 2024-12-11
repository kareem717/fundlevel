package investment

import (
	"context"
	"fmt"
	"strconv"
	"time"

	"fundlevel/internal/entities/investment"
	"fundlevel/internal/entities/position"
	"fundlevel/internal/storage"

	"github.com/stripe/stripe-go/v80"
	"github.com/stripe/stripe-go/v80/paymentintent"
)

const (
	InvestmentIDMetadataKey        = "investment_id"
	InvestmentPaymentIDMetadatakey = "investment_payment_id"
)

func (s *InvestmentService) CreateStripePaymentIntent(
	ctx context.Context,
	investmentId int,
) (*stripe.PaymentIntent, error) {
	investment, err := s.repositories.Investment().GetById(ctx, investmentId)
	if err != nil {
		return nil, err
	}

	round, err := s.repositories.Round().GetById(ctx, investment.RoundID)
	if err != nil {
		return nil, err
	}

	// So we know who to send the money to after payment
	businessStripeAccount, err := s.repositories.Business().GetStripeAccount(ctx, round.BusinessID)
	if err != nil {
		return nil, err
	}

	var resp *stripe.PaymentIntent
	err = s.repositories.RunInTx(ctx, func(ctx context.Context, tx storage.Transaction) error {
		buyInCents := calculateBuyInCents(round.ValuationAmountUSDCents, round.PercentageSelling, round.InvestorCount)

		//TODO: how can we make this not hard coded?
		feeCents := float64(buyInCents) * s.feePercentage

		totalAmount := float64(buyInCents) + feeCents

		stripe.Key = s.stripeAPIKey

		paymentIntentParams := &stripe.PaymentIntentParams{
			Amount: stripe.Int64(int64(totalAmount)),
			// TODO: make this dynamic
			Currency:             stripe.String(string(stripe.CurrencyUSD)),
			ApplicationFeeAmount: stripe.Int64(int64(feeCents)),
			TransferData: &stripe.PaymentIntentTransferDataParams{
				Destination: stripe.String(businessStripeAccount.StripeConnectedAccountID),
			},
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

		resp, err = paymentintent.New(paymentIntentParams)
		if err != nil {
			return err
		}

		return nil
	})

	return resp, nil
}

func (s *InvestmentService) HandleStripePaymentIntentCreated(ctx context.Context, intentID string) error {
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

	investmentRecord, err := s.repositories.Investment().GetById(ctx, parsedInvestmentId)
	if err != nil {
		return fmt.Errorf("failed to get investment: %w", err)
	}

	if investmentRecord.PaymentCompletedAt != nil {
		return fmt.Errorf("investment payment is already completed")
	}

	if investmentRecord.TermsCompletedAt == nil {
		return fmt.Errorf("investment terms are not completed")
	}

	if investmentRecord.ApprovedAt == nil {
		return fmt.Errorf("investment requires manual approval but is not approved")
	}

	if investmentRecord.Status != investment.InvestmentStatusAwaitingApproval {
		return fmt.Errorf("investment is not in the correct state to create a payment intent")
	}

	err = s.repositories.RunInTx(ctx, func(ctx context.Context, tx storage.Transaction) error {
		paymentRecord, err := tx.Investment().CreatePayment(ctx, investment.CreateInvestmentPaymentParams{
			InvestmentID:                    parsedInvestmentId,
			StripePaymentIntentID:           intent.ID,
			StripePaymentIntentClientSecret: intent.ClientSecret,
			Status:                          intent.Status,
		})
		if err != nil {
			return err
		}

		_, err = tx.Investment().Update(ctx, parsedInvestmentId, investment.UpdateInvestmentParams{
			Status: investment.InvestmentStatusPayment,
		})
		if err != nil {
			return err
		}

		// Add the payment ID to the metadata so we can find it later need be
		// This is arguably unnesseary but might help to debug or decouple
		// from stripe later down the line
		if _, err := paymentintent.Update(intent.ID, &stripe.PaymentIntentParams{
			Metadata: map[string]string{
				InvestmentPaymentIDMetadatakey: strconv.Itoa(paymentRecord.ID),
			},
		}); err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		// If we're unable to create the payment record, we need to cancel the Stripe payment intent
		_, err = paymentintent.Cancel(intent.ID, nil)
		if err != nil {
			return fmt.Errorf("failed to cancel Stripe payment intent: %w", err)
		}

		return err
	}

	return nil
}

func (s *InvestmentService) HandleStripePaymentIntentSucceeded(ctx context.Context, intentID string) error {
	now := time.Now()
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

	investmentRecord, err := s.repositories.Investment().GetById(ctx, parsedInvestmentId)
	if err != nil {
		return fmt.Errorf("failed to get investment: %w", err)
	}

	if investmentRecord.Status != investment.InvestmentStatusPayment {
		return fmt.Errorf("investment status is not payment")
	}

	err = s.repositories.RunInTx(ctx, func(ctx context.Context, tx storage.Transaction) error {
		_, err = tx.Investment().Update(ctx, parsedInvestmentId, investment.UpdateInvestmentParams{
			Status:             investment.InvestmentStatusCompleted,
			PaymentCompletedAt: &now,
			CompletedAt:        &now,
		})
		if err != nil {
			return err
		}

		_, err = tx.Investment().UpdatePayment(ctx, parsedInvestmentId, investment.UpdateInvestmentPaymentParams{
			Status: intent.Status,
		})
		if err != nil {
			return err
		}

		_, err = tx.Position().Create(ctx, position.CreatePositionParams{
			InvestmentID: parsedInvestmentId,
		})
		if err != nil {
			return err
		}

		return nil
	})

	return nil
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

	_, err = s.repositories.Investment().UpdatePayment(ctx, paymentRecord.ID, investment.UpdateInvestmentPaymentParams{
		Status: intent.Status,
	})

	return err
}

// func (s *InvestmentService) HandleInvestmentPaymentIntentProcessing(ctx context.Context, intentID string) error {
// 	stripe.Key = s.stripeAPIKey

// 	intent, err := s.getStripePaymentIntent(intentID)
// 	if err != nil {
// 		return err
// 	}

// 	investmentId, ok := intent.Metadata[InvestmentIDMetadataKey]
// 	if !ok {
// 		return fmt.Errorf("investment ID not found in session metadata")
// 	}

// 	err = s.repositories.RunInTx(ctx, func(ctx context.Context, tx storage.Transaction) error {
// 		parsedInvestmentId, err := strconv.Atoi(investmentId)
// 		if err != nil {
// 			return fmt.Errorf("failed to convert round ID to int: %w", err)
// 		}

// 		investmentRecord, err := tx.Investment().GetById(ctx, parsedInvestmentId)
// 		if err != nil {
// 			return fmt.Errorf("failed to get investment: %w", err)
// 		}

// 		_, err = tx.Investment().UpdatePayment(ctx, investmentRecord.ID, investment.UpdateInvestmentPaymentParams{
// 			Status: intent.Status,
// 		})
// 		if err != nil {
// 			return fmt.Errorf("failed to create investment payment: %w", err)
// 		}

// 		return nil
// 	})

// 	return err
// }

// func (s *InvestmentService) ProcessInvestment(ctx context.Context, investmentId int) error {
// 	stripe.Key = s.stripeAPIKey

// 	updateParams := investment.UpdateInvestmentParams{}
// 	updateParams.Status = investment.InvestmentStatusSuccessful

// 	return s.repositories.RunInTx(ctx, func(ctx context.Context, tx storage.Transaction) error {
// 		investmentRecord, err := s.repositories.Investment().Update(ctx, investmentId, updateParams)
// 		if err != nil {
// 			return err
// 		}

// 		paymentRecord, err := tx.Investment().GetPayment(ctx, investmentRecord.ID)
// 		if err != nil {
// 			return err
// 		}

// 		paymentIntent, err := paymentintent.Get(paymentRecord.StripePaymentIntentID, nil)
// 		if err != nil {
// 			return err
// 		}

// 		_, err = s.repositories.Investment().UpdatePayment(
// 			ctx,
// 			paymentRecord.InvestmentID,
// 			investment.UpdateInvestmentPaymentParams{
// 				// Status is updated to success as this is intended to be the final step - if desired we can delay this step
// 				Status: paymentIntent.Status,
// 			})
// 		if err != nil {
// 			return fmt.Errorf("failed to update payment: %w", err)
// 		}

// 		_, err = s.repositories.Investment().Update(
// 			ctx,
// 			investmentRecord.ID,
// 			investment.UpdateInvestmentParams{
// 				Status: investment.InvestmentStatusSuccessful,
// 			})
// 		if err != nil {
// 			return fmt.Errorf("failed to update investment: %w", err)
// 		}

// 		_, err = s.repositories.Round().Update(
// 			ctx,
// 			investmentRecord.RoundID,
// 			round.UpdateRoundParams{
// 				Status: round.RoundStatusSuccessful,
// 			})
// 		if err != nil {
// 			return fmt.Errorf("failed to update round: %w", err)
// 		}

// 		//update all investments in round to closed
// 		err = s.repositories.Investment().
// 			UpdateProcessingAndPendingInvestmentsByRoundId(
// 				ctx,
// 				investmentRecord.RoundID,
// 				investment.InvestmentStatusRoundClosed,
// 			)
// 		if err != nil {
// 			return fmt.Errorf("failed to update non successful investments: %w", err)
// 		}

// 		_, err = paymentintent.Capture(paymentRecord.StripePaymentIntentID, nil)
// 		if err != nil {
// 			return err
// 		}

// 		return nil
// 	})
// }

// func (s *InvestmentService) HandleInvestmentPaymentIntentPaymentFailed(ctx context.Context, intentID string) error {
// 	stripe.Key = s.stripeAPIKey

// 	intent, err := s.getStripePaymentIntent(intentID)
// 	if err != nil {
// 		return err
// 	}

// 	investmentID, ok := intent.Metadata[RoundIDMetadataKey]
// 	if !ok {
// 		return fmt.Errorf("investment ID not found in session metadata")
// 	}

// 	err = s.repositories.RunInTx(ctx, func(ctx context.Context, tx storage.Transaction) error {
// 		investmentId, err := strconv.Atoi(investmentID)
// 		if err != nil {
// 			return fmt.Errorf("failed to convert investment ID to int: %w", err)
// 		}

// 		investmentRecord, err := s.repositories.Investment().GetById(ctx, investmentId)
// 		if err != nil {
// 			if errors.Is(err, sql.ErrNoRows) {
// 				return fmt.Errorf("investment not found")
// 			}
// 			return fmt.Errorf("failed to get investment: %w", err)
// 		}

// 		payment, err := s.repositories.Investment().GetPayment(ctx, investmentRecord.ID)
// 		if err != nil {
// 			if errors.Is(err, sql.ErrNoRows) {
// 				return fmt.Errorf("no payment found for intent ID")
// 			}
// 			return fmt.Errorf("failed to get payment: %w", err)
// 		}

// 		if payment.InvestmentID != investmentRecord.ID {
// 			return fmt.Errorf("payment does not match investment")
// 		}

// 		updateParams := investment.UpdateInvestmentPaymentParams{
// 			// Status is updated to success as this is intended to be the final step - if desired we can delay this step
// 			Status: intent.Status,
// 		}

// 		_, err = s.repositories.Investment().UpdatePayment(ctx, payment.InvestmentID, updateParams)
// 		if err != nil {
// 			return fmt.Errorf("failed to update investment: %w", err)
// 		}

// 		//TODO: update round state

// 		return nil
// 	})

// 	return err
// }

// func (s *InvestmentService) HandleInvestmentPaymentIntentCancelled(ctx context.Context, intentID string) error {
// 	stripe.Key = s.stripeAPIKey

// 	intent, err := s.getStripePaymentIntent(intentID)
// 	if err != nil {
// 		return err
// 	}

// 	investmentID, ok := intent.Metadata[RoundIDMetadataKey]
// 	if !ok {
// 		return fmt.Errorf("investment ID not found in session metadata")
// 	}

// 	err = s.repositories.RunInTx(ctx, func(ctx context.Context, tx storage.Transaction) error {
// 		investmentId, err := strconv.Atoi(investmentID)
// 		if err != nil {
// 			return fmt.Errorf("failed to convert investment ID to int: %w", err)
// 		}

// 		investmentRecord, err := s.repositories.Investment().GetById(ctx, investmentId)
// 		if err != nil {
// 			if errors.Is(err, sql.ErrNoRows) {
// 				return fmt.Errorf("investment not found")
// 			}
// 			return fmt.Errorf("failed to get investment: %w", err)
// 		}

// 		payment, err := s.repositories.Investment().GetPayment(ctx, investmentRecord.ID)
// 		if err != nil {
// 			if errors.Is(err, sql.ErrNoRows) {
// 				return fmt.Errorf("no payment found for intent ID")
// 			}
// 			return fmt.Errorf("failed to get payment: %w", err)
// 		}

// 		if payment.InvestmentID != investmentRecord.ID {
// 			return fmt.Errorf("payment does not match investment")
// 		}

// 		updateParams := investment.UpdateInvestmentPaymentParams{
// 			// Status is updated to success as this is intended to be the final step - if desired we can delay this step
// 			Status: intent.Status,
// 		}

// 		_, err = s.repositories.Investment().UpdatePayment(ctx, payment.InvestmentID, updateParams)
// 		if err != nil {
// 			return fmt.Errorf("failed to update investment: %w", err)
// 		}

// 		//TODO: update round state

// 		return nil
// 	})

// 	return err
// }
