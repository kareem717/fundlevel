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
	"github.com/stripe/stripe-go/v80/account"
	"github.com/stripe/stripe-go/v80/accountlink"
	"github.com/stripe/stripe-go/v80/checkout/session"
	"github.com/stripe/stripe-go/v80/loginlink"
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

func (s *BillingService) CreateInvestmentCheckoutSession(
	ctx context.Context,
	price int,
	successURL string,
	cancelURL string,
	investmentId int,
	currency shared.Currency,
	businessStripeAccountID string,
) (string, error) {
	feeCents := (float64(price) * s.feePercentage)

	stripe.Key = s.stripeAPIKey
	fmt.Println(stripe.Key)
	checkoutParams := &stripe.CheckoutSessionParams{
		SuccessURL: stripe.String(successURL),
		UIMode:     stripe.String("embedded"),
		CancelURL:  stripe.String(cancelURL),
		LineItems: []*stripe.CheckoutSessionLineItemParams{
			{
				PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
					Currency:   stripe.String(string(currency)),
					UnitAmount: stripe.Int64(int64(price)),
					Product:    stripe.String(s.investmentFeeProductID),
				},
				Quantity: stripe.Int64(1),
			},
		},
		PaymentIntentData: &stripe.CheckoutSessionPaymentIntentDataParams{
			ApplicationFeeAmount: stripe.Int64(int64(feeCents)),
			TransferData: &stripe.CheckoutSessionPaymentIntentDataTransferDataParams{
				Destination: stripe.String(businessStripeAccountID),
			},
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

	return resp.ClientSecret, nil
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
			return fmt.Errorf("failed to update investment: %w", err)
		}

		//! This is where we capture the payment
		_, err = paymentintent.Capture(paymentIntent.ID, &stripe.PaymentIntentCaptureParams{})
		if err != nil {
			return err
		}

		//TODO: update round state

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

// CreateAccountLink creates a new on boarding session for a Stripe Connect connected account
func (s *BillingService) CreateAccountLink(ctx context.Context, accountID string, returnURL string, refreshURL string) (string, error) {
	stripe.Key = s.stripeAPIKey

	account, err := account.GetByID(accountID, nil)
	if err != nil {
		return "", err
	}

	if account == nil {
		return "", fmt.Errorf("account is not connected to Stripe Connect")
	}

	accountLink, err := accountlink.New(&stripe.AccountLinkParams{
		Account:    stripe.String(account.ID),
		ReturnURL:  stripe.String(returnURL),
		RefreshURL: stripe.String(refreshURL),
		Type:       stripe.String("account_onboarding"),
	})
	if err != nil {
		return "", err
	}

	return accountLink.URL, nil
}

func (s *BillingService) CreateStripeConnectedAccount(ctx context.Context) (stripe.Account, error) {
	stripe.Key = s.stripeAPIKey

	account, err := account.New(&stripe.AccountParams{})
	if err != nil {
		return stripe.Account{}, err
	}

	return *account, nil
}

func (s *BillingService) GetStripeConnectedAccountDashboardURL(ctx context.Context, accountID string) (string, error) {
	stripe.Key = s.stripeAPIKey

	account, err := account.GetByID(accountID, nil)
	if err != nil {
		return "", err
	}

	params := &stripe.LoginLinkParams{
		Account: stripe.String(account.ID),
	}
	result, err := loginlink.New(params)
	if err != nil {
		return "", err
	}

	return result.URL, nil
}

func (s *BillingService) DeleteStripeConnectedAccount(ctx context.Context, accountID string) error {
	stripe.Key = s.stripeAPIKey

	_, err := account.Del(accountID, nil)
	if err != nil {
		return err
	}

	return nil
}

func (s *BillingService) getStripeSession(sessionID string) (*stripe.CheckoutSession, error) {
	stripe.Key = s.stripeAPIKey
	return session.Get(sessionID, nil)
}
