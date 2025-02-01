package investment

import (
	"context"
	"errors"
	"fmt"
	"strconv"

	"fundlevel/internal/entities/investment"
	"fundlevel/internal/entities/round"
	"fundlevel/internal/service/types"
	"fundlevel/internal/storage"

	"go.uber.org/zap"

	"github.com/stripe/stripe-go/v81"
	"github.com/stripe/stripe-go/v81/paymentintent"
)

const (
	InvestmentIDMetadataKey        = "investment_id"
	InvestmentPaymentIDMetadatakey = "investment_payment_id"
	InvestmentRoundIDMetadataKey   = "investment_round_id"
)

func (s *InvestmentService) HandleStripePaymentIntentFailed(ctx context.Context, intentID string) error {
	stripe.Key = s.stripeAPIKey

	//TODO: implement with confirmation
	// intent, err := paymentintent.Get(intentID, nil)
	// if err != nil {
	// 	return err
	// }

	// investmentId, ok := intent.Metadata[InvestmentIDMetadataKey]
	// if !ok {
	// 	return fmt.Errorf("investment ID not found in session metadata")
	// }

	// parsedInvestmentId, err := strconv.Atoi(investmentId)
	// if err != nil {
	// 	return fmt.Errorf("failed to convert investment ID to int: %w", err)
	// }

	// failedPaymentCount, err := s.repositories.Investment().GetFailedPaymentCount(ctx, parsedInvestmentId)
	// if err != nil {
	// 	return err
	// }

	// //todo: O(n) is not ideal, but i think its faster than a map due to small n
	// // If the payment intent was cancelled due to a serious reason or we've tried too many times,
	// // we need to mark the investment as failed
	// if failedPaymentCount >= 4 || !slices.Contains([]stripe.PaymentIntentCancellationReason{
	// 	stripe.PaymentIntentCancellationReasonFailedInvoice,
	// 	stripe.PaymentIntentCancellationReasonAbandoned,
	// 	stripe.PaymentIntentCancellationReasonVoidInvoice,
	// 	stripe.PaymentIntentCancellationReasonAutomatic,
	// }, intent.CancellationReason) {
	// 	return nil
	// }

	// investmentRecord, err := s.repositories.Investment().GetById(ctx, parsedInvestmentId)
	// if err != nil {
	// 	return err
	// }

	// roundRecord, err := s.repositories.Round().GetById(ctx, investmentRecord.RoundID)
	// if err != nil {
	// 	return err
	// }

	// // Otherwise, we lets let them try paying again
	// err = s.repositories.RunInTx(ctx, func(ctx context.Context, tx storage.Transaction) error {
	// 	investmentCentValue := roundRecord.PricePerShareUSDCents * int64(roundRecord.TotalSharesForSale)

	// 	intent, err = s.createStripePaymentIntent(parsedInvestmentId, investmentCentValue)
	// 	if err != nil {
	// 		return err
	// 	}

	// 	_, err = tx.Investment().CreatePayment(ctx, investmentRecord.ID, investment.CreatePaymentParams{
	// 		StripePaymentIntentID:           intent.ID,
	// 		StripePaymentIntentClientSecret: intent.ClientSecret,
	// 		Status:                          intent.Status,
	// 	})

	// 	return err
	// })
	// if err != nil {
	// 	return err
	// }

	return nil
}

func (s *InvestmentService) HandleStripePaymentIntentSucceeded(ctx context.Context, intentID string) error {
	stripe.Key = s.stripeAPIKey

	intent, err := paymentintent.Get(intentID, nil)
	if err != nil {
		return err
	}

	paymentId, ok := intent.Metadata[InvestmentPaymentIDMetadatakey]
	if !ok {
		return fmt.Errorf("investment payment ID not found in session metadata")
	}

	parsedPaymentId, err := strconv.Atoi(paymentId)
	if err != nil {
		return fmt.Errorf("failed to convert investment payment ID to int: %w", err)
	}

	roundId, ok := intent.Metadata[InvestmentRoundIDMetadataKey]
	if !ok {
		return fmt.Errorf("investment round ID not found in session metadata")
	}

	parsedRoundId, err := strconv.Atoi(roundId)
	if err != nil {
		return fmt.Errorf("failed to convert investment round ID to int: %w", err)
	}

	err = s.repositories.RunInTx(ctx, func(ctx context.Context, tx storage.Transaction) error {
		_, err := tx.Investment().UpdatePayment(ctx, parsedPaymentId, investment.UpdatePaymentParams{
			Status: &intent.Status,
		})
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

		paymentCompletedStatus := investment.InvestmentStatusPaymentCompleted
		_, err = tx.Investment().Update(ctx, parsedInvestmentId, investment.UpdateInvestmentParams{
			Status: &paymentCompletedStatus,
		})

		if err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		return err
	}

	availableShares, err := s.repositories.Round().GetAvailableShares(ctx, parsedRoundId)
	if err != nil {
		return err
	}

	if availableShares < 1 {
		s.logger.Info("no available shares left, completing round", zap.String("round_id", strconv.Itoa(parsedRoundId)))
		// We do this so that if it fails, the webhook will retry
		err = s.roundService.CompleteRound(ctx, parsedRoundId)
		if err != nil {
			s.logger.Error("failed to complete round", zap.String("round_id", strconv.Itoa(parsedRoundId)), zap.Error(err))
			return err
		}
	}

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

	_, err = s.repositories.Investment().UpdatePayment(ctx, paymentRecord.ID, investment.UpdatePaymentParams{
		Status: &intent.Status,
	})

	return err
}

func (s *InvestmentService) ConfirmPaymentIntent(ctx context.Context, investmentId int, confirmationToken string, returnURL string) (types.StripePaymentIntentOutput, error) {
	stripe.Key = s.stripeAPIKey
	resp := types.StripePaymentIntentOutput{}

	investmentRecord, err := s.repositories.Investment().GetById(ctx, investmentId)
	if err != nil {
		return resp, err
	}

	if investmentRecord.Status == investment.InvestmentStatusRoundClosed {
		s.logger.Info("attempting to confirm payment for a round that is closed", zap.String("investment_id", strconv.Itoa(investmentId)))
		return resp, errors.New("this investment is unable to be completed as the round is closed")
	}

	roundRecord, err := s.repositories.Round().GetById(ctx, investmentRecord.RoundID)
	if err != nil {
		return resp, err
	}

	if roundRecord.Status == round.RoundStatusSuccessful {
		s.logger.Info("attempting to confirm payment for a round that is successful", zap.String("round_id", strconv.Itoa(roundRecord.ID)))
		return resp, errors.New("this investment is unable to be completed as the round is successful")
	}

	subtotal := roundRecord.PricePerShareUSDCents * int64(investmentRecord.ShareQuantity)
	totalUsdCentsWithFee := calculateAmountWithServiceFee(subtotal, s.feePercentage)

	err = s.repositories.RunInTx(ctx, func(ctx context.Context, tx storage.Transaction) error {
		availableShares, err := tx.Round().GetAvailableShares(ctx, roundRecord.ID)
		if err != nil {
			return err
		}

		if availableShares < investmentRecord.ShareQuantity {
			return fmt.Errorf("not enough shares available")
		}

		newIntent, err := paymentintent.New(&stripe.PaymentIntentParams{
			Amount:            stripe.Int64(totalUsdCentsWithFee),
			Currency:          stripe.String(string(stripe.CurrencyUSD)),
			ConfirmationToken: stripe.String(confirmationToken),
			Confirm:           stripe.Bool(true),
			AutomaticPaymentMethods: &stripe.PaymentIntentAutomaticPaymentMethodsParams{
				Enabled: stripe.Bool(true),
			},
			PaymentMethodOptions: &stripe.PaymentIntentPaymentMethodOptionsParams{
				ACSSDebit: &stripe.PaymentIntentPaymentMethodOptionsACSSDebitParams{
					MandateOptions: &stripe.PaymentIntentPaymentMethodOptionsACSSDebitMandateOptionsParams{
						PaymentSchedule: stripe.String(string(stripe.PaymentIntentPaymentMethodOptionsACSSDebitMandateOptionsPaymentScheduleSporadic)),
						TransactionType: stripe.String(string(stripe.PaymentIntentPaymentMethodOptionsACSSDebitMandateOptionsTransactionTypePersonal)),
					},
				},
			},
			ReturnURL: stripe.String(returnURL),
			Metadata: map[string]string{
				InvestmentIDMetadataKey: strconv.Itoa(investmentId),
			},
		})

		payment, err := s.repositories.Investment().CreatePayment(ctx, investmentId, investment.CreatePaymentParams{
			StripePaymentIntentID:           newIntent.ID,
			StripePaymentIntentClientSecret: newIntent.ClientSecret,
			Status:                          newIntent.Status,
		})

		if err != nil {
			s.logger.Error("failed to create payment in db", zap.String("intent_id", newIntent.ID), zap.Error(err))
			return err
		}

		_, err = paymentintent.Update(newIntent.ID, &stripe.PaymentIntentParams{
			Metadata: map[string]string{
				InvestmentIDMetadataKey:        strconv.Itoa(investmentId),
				InvestmentPaymentIDMetadatakey: strconv.Itoa(payment.ID),
				InvestmentRoundIDMetadataKey:   strconv.Itoa(roundRecord.ID),
			},
		})

		if err != nil {
			s.logger.Error("failed to update payment intent on stripe", zap.String("intent_id", newIntent.ID), zap.Error(err))
			return err
		}

		status := investment.InvestmentStatusAwaitingPayment
		_, err = s.repositories.Investment().Update(ctx, investmentId, investment.UpdateInvestmentParams{
			Status: &status,
		})
		if err != nil {
			s.logger.Error("failed to update investment status", zap.String("investment_id", strconv.Itoa(investmentId)), zap.Error(err))
			return err
		}

		s.logger.Info("updated payment intent on stripe", zap.String("intent_id", newIntent.ID), zap.String("payment_id", strconv.Itoa(payment.ID)))

		if err != nil {
			s.logger.Error("failed to update payment intent on stripe", zap.String("intent_id", newIntent.ID), zap.Error(err))

			//try to delete the payment intent on stripe
			_, err = paymentintent.Cancel(newIntent.ID, nil)
			if err != nil {
				s.logger.Error("failed to cancel payment intent on stripe", zap.String("intent_id", newIntent.ID), zap.Error(err))
			}

			return err
		}

		resp.ClientSecret = newIntent.ClientSecret
		resp.Status = newIntent.Status

		return nil
	})

	return resp, err
}

// calculateAmountWithServiceFee calculates the total investment amount including the service fee
func calculateAmountWithServiceFee(subTotalUsdCents int64, feePercentage float64) int64 {
	return int64(float64(subTotalUsdCents) * (1 + feePercentage))
}
