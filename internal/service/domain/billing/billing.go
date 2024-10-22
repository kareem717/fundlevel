package billing

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"fundlevel/internal/entities/investment"
	"fundlevel/internal/entities/shared"
	"fundlevel/internal/storage"
	"strconv"
	"time"

	"github.com/stripe/stripe-go/v80"
	"github.com/stripe/stripe-go/v80/checkout/session"
	"github.com/stripe/stripe-go/v80/paymentintent"
)

type BillingServiceConfig struct {
	FeePercentage           float64
	TransactionFeeProductID string
	InvestmentFeeProductID  string
	StripeAPIKey            string
}

type BillingService struct {
	repositories            storage.Repository
	feePercentage           float64
	transactionFeeProductID string
	investmentFeeProductID  string
	stripeAPIKey            string
}

const (
	InvestmentIDMetadataKey = "investmentId"
)

// NewBillingService returns a new instance of billing service.
func NewBillingService(repositories storage.Repository, config BillingServiceConfig) *BillingService {
	return &BillingService{
		repositories:            repositories,
		feePercentage:           config.FeePercentage,
		transactionFeeProductID: config.TransactionFeeProductID,
		investmentFeeProductID:  config.InvestmentFeeProductID,
		stripeAPIKey:            config.StripeAPIKey,
	}
}

func (s *BillingService) CreateInvestmentCheckoutSession(ctx context.Context, price int, successURL string, cancelURL string, investmentId int, currency shared.Currency) (string, error) {
	feeCents := (float64(price) * s.feePercentage)

	stripe.Key = s.stripeAPIKey
	fmt.Println(stripe.Key)
	checkoutParams := &stripe.CheckoutSessionParams{
		SuccessURL: stripe.String(successURL),
		CancelURL:  stripe.String(cancelURL),
		LineItems: []*stripe.CheckoutSessionLineItemParams{
			{
				PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
					Currency:   stripe.String(string(currency)),
					UnitAmount: stripe.Int64(int64(price)),
					Product:    stripe.String(s.transactionFeeProductID),
				},
				Quantity: stripe.Int64(1),
			},
			{
				PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
					Currency:   stripe.String(string(currency)),
					UnitAmount: stripe.Int64(int64(feeCents)),
					Product:    stripe.String(s.investmentFeeProductID),
				},
				Quantity: stripe.Int64(1),
			},
		},
		PaymentIntentData: &stripe.CheckoutSessionPaymentIntentDataParams{
			CaptureMethod: stripe.String(string(stripe.PaymentIntentCaptureMethodManual)),
		},
		Mode: stripe.String(string(stripe.CheckoutSessionModePayment)),
		Metadata: map[string]string{
			InvestmentIDMetadataKey: strconv.Itoa(investmentId),
		},
	}

	resp, err := session.New(checkoutParams)
	if err != nil {
		return "", err
	}

	return resp.URL, nil
}

func (s *BillingService) HandleInvestmentCheckoutSuccess(ctx context.Context, sessionID string) (string, error) {
	now := time.Now()

	stripe.Key = s.stripeAPIKey

	session, err := s.getStripeSession(sessionID)
	if err != nil {
		return "", err
	}

	investmentID, ok := session.Metadata[InvestmentIDMetadataKey]
	if !ok {
		return "", fmt.Errorf("investment ID not found in session metadata")
	}

	paymentIntent := session.PaymentIntent

	err = s.repositories.RunInTx(ctx, func(ctx context.Context, tx storage.Transaction) error {
		params := &stripe.PaymentIntentCaptureParams{}
		_, err := paymentintent.Capture(paymentIntent.ID, params)
		if err != nil {
			return err
		}

		investmentId, err := strconv.Atoi(investmentID)
		if err != nil {
			return fmt.Errorf("failed to convert investment ID to int: %w", err)
		}

		_, err = s.repositories.Investment().GetById(ctx, investmentId)
		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				return fmt.Errorf("investment not found")
			}
			return fmt.Errorf("failed to get investment: %w", err)
		}

		updateParams := investment.UpdateInvestmentParams{
			// Status is updated to success as this is intended to be the final step - if desired we can delay this step
			Status:                  investment.InvestmentStatusSuccessful,
			PaidAt:                  &now,
			StripeCheckoutSessionID: &session.ID,
		}

		_, err = s.repositories.Investment().Update(ctx, investmentId, updateParams)
		if err != nil {
			// TODO: figure out how to reverse the transaction if it fails
			return fmt.Errorf("failed to update investment: %w", err)
		}

		return nil
	})

	if err != nil {
		params := &stripe.PaymentIntentCancelParams{}
		_, err := paymentintent.Cancel(paymentIntent.ID, params)
		if err != nil {
			return "", err
		}
	}

	return session.SuccessURL, err
}

func (s *BillingService) getStripeSession(sessionID string) (*stripe.CheckoutSession, error) {
	stripe.Key = s.stripeAPIKey
	return session.Get(sessionID, nil)
}
