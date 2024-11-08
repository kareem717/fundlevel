package billing

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"fundlevel/internal/entities/investment"
	"fundlevel/internal/entities/round"
	"fundlevel/internal/entities/shared"
	"fundlevel/internal/storage"
	"strconv"

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
	InvestmentIDMetadataKey = "investment_id"
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

func (s *BillingService) CreateInvestmentPaymentIntent(
	ctx context.Context,
	price int,
	investmentId int,
	currency shared.Currency,
	businessStripeAccountID string,
) (*stripe.PaymentIntent, error) {
	feeCents := (float64(price) * s.feePercentage)
	totalAmount := (float64(price) + feeCents)
	stripe.Key = s.stripeAPIKey

	paymentIntentParams := &stripe.PaymentIntentParams{
		Amount:   stripe.Int64(int64(totalAmount)),
		Currency: stripe.String(string(currency)),
		// PaymentIntentData: &stripe.PaymentIntentDataParams{
		ApplicationFeeAmount: stripe.Int64(int64(feeCents)),
		TransferData: &stripe.PaymentIntentTransferDataParams{
			Destination: stripe.String(businessStripeAccountID),
		},
		// Mode: stripe.String(string(stripe.CheckoutSessionModePayment)),
		Metadata: map[string]string{
			InvestmentIDMetadataKey: strconv.Itoa(investmentId),
		},
	}

	resp, err := paymentintent.New(paymentIntentParams)
	if err != nil {
		return nil, err
	}

	return resp, nil
}

func (s *BillingService) HandleInvestmentPaymentIntentSuccess(ctx context.Context, intentID string) error {
	stripe.Key = s.stripeAPIKey

	intent, err := s.getStripePaymentIntent(intentID)
	if err != nil {
		return err
	}

	investmentID, ok := intent.Metadata[InvestmentIDMetadataKey]
	if !ok {
		return fmt.Errorf("investment ID not found in session metadata")
	}

	err = s.repositories.RunInTx(ctx, func(ctx context.Context, tx storage.Transaction) error {
		investmentId, err := strconv.Atoi(investmentID)
		if err != nil {
			return fmt.Errorf("failed to convert investment ID to int: %w", err)
		}

		investmentRecord, err := s.repositories.Investment().GetById(ctx, investmentId)
		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				return fmt.Errorf("investment not found")
			}
			return fmt.Errorf("failed to get investment: %w", err)
		}

		payment, err := s.repositories.Investment().GetPayment(ctx, investmentRecord.ID)
		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				return fmt.Errorf("no payment found for intent ID")
			}
			return fmt.Errorf("failed to get payment: %w", err)
		}

		if payment.RoundInvestmentID != investmentRecord.ID {
			return fmt.Errorf("payment does not match investment")
		}

		paymentUpdateParams := investment.UpdateRoundInvestmentPaymentParams{
			// Status is updated to success as this is intended to be the final step - if desired we can delay this step
			Status: intent.Status,
		}

		_, err = s.repositories.Investment().UpdatePayment(ctx, payment.RoundInvestmentID, paymentUpdateParams)
		if err != nil {
			return fmt.Errorf("failed to update payment: %w", err)
		}

		investmentUpdateParams := investment.UpdateInvestmentParams{
			Status: investment.InvestmentStatusSuccessful,
		}

		_, err = s.repositories.Investment().Update(ctx, investmentRecord.ID, investmentUpdateParams)
		if err != nil {
			return fmt.Errorf("failed to update investment: %w", err)
		}

		roundUpdateParams := round.UpdateRoundParams{
			Status: round.RoundStatusSuccessful,
		}

		_, err = s.repositories.Round().Update(ctx, investmentRecord.RoundID, roundUpdateParams)
		if err != nil {
			return fmt.Errorf("failed to update round: %w", err)
		}

		//update all investments in round to closed
		err = s.repositories.Investment().UpdateProcessingAndPendingInvestmentsByRoundId(ctx, investmentRecord.RoundID, investment.InvestmentStatusRoundClosed)
		if err != nil {
			return fmt.Errorf("failed to update non successful investments: %w", err)
		}

		return nil
	})
	//todo: handle payment intent reversal if needed

	return err
}

func (s *BillingService) HandleInvestmentPaymentIntentProcessing(ctx context.Context, intentID string) error {
	stripe.Key = s.stripeAPIKey

	intent, err := s.getStripePaymentIntent(intentID)
	if err != nil {
		return err
	}

	investmentID, ok := intent.Metadata[InvestmentIDMetadataKey]
	if !ok {
		return fmt.Errorf("investment ID not found in session metadata")
	}

	err = s.repositories.RunInTx(ctx, func(ctx context.Context, tx storage.Transaction) error {
		investmentId, err := strconv.Atoi(investmentID)
		if err != nil {
			return fmt.Errorf("failed to convert investment ID to int: %w", err)
		}

		investmentRecord, err := s.repositories.Investment().GetById(ctx, investmentId)
		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				return fmt.Errorf("investment not found")
			}
			return fmt.Errorf("failed to get investment: %w", err)
		}

		payment, err := s.repositories.Investment().GetPayment(ctx, investmentRecord.ID)
		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				return fmt.Errorf("no payment found for intent ID")
			}
			return fmt.Errorf("failed to get payment: %w", err)
		}

		if payment.RoundInvestmentID != investmentRecord.ID {
			return fmt.Errorf("payment does not match investment")
		}

		updateParams := investment.UpdateRoundInvestmentPaymentParams{
			// Status is updated to success as this is intended to be the final step - if desired we can delay this step
			Status: intent.Status,
		}

		_, err = s.repositories.Investment().UpdatePayment(ctx, payment.RoundInvestmentID, updateParams)
		if err != nil {
			return fmt.Errorf("failed to update investment: %w", err)
		}

		//TODO: update round state

		return nil
	})

	return err
}

func (s *BillingService) HandleInvestmentPaymentIntentPaymentFailed(ctx context.Context, intentID string) error {
	stripe.Key = s.stripeAPIKey

	intent, err := s.getStripePaymentIntent(intentID)
	if err != nil {
		return err
	}

	investmentID, ok := intent.Metadata[InvestmentIDMetadataKey]
	if !ok {
		return fmt.Errorf("investment ID not found in session metadata")
	}

	err = s.repositories.RunInTx(ctx, func(ctx context.Context, tx storage.Transaction) error {
		investmentId, err := strconv.Atoi(investmentID)
		if err != nil {
			return fmt.Errorf("failed to convert investment ID to int: %w", err)
		}

		investmentRecord, err := s.repositories.Investment().GetById(ctx, investmentId)
		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				return fmt.Errorf("investment not found")
			}
			return fmt.Errorf("failed to get investment: %w", err)
		}

		payment, err := s.repositories.Investment().GetPayment(ctx, investmentRecord.ID)
		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				return fmt.Errorf("no payment found for intent ID")
			}
			return fmt.Errorf("failed to get payment: %w", err)
		}

		if payment.RoundInvestmentID != investmentRecord.ID {
			return fmt.Errorf("payment does not match investment")
		}

		updateParams := investment.UpdateRoundInvestmentPaymentParams{
			// Status is updated to success as this is intended to be the final step - if desired we can delay this step
			Status: intent.Status,
		}

		_, err = s.repositories.Investment().UpdatePayment(ctx, payment.RoundInvestmentID, updateParams)
		if err != nil {
			return fmt.Errorf("failed to update investment: %w", err)
		}

		//TODO: update round state

		return nil
	})

	return err
}

func (s *BillingService) HandleInvestmentPaymentIntentCancelled(ctx context.Context, intentID string) error {
	stripe.Key = s.stripeAPIKey

	intent, err := s.getStripePaymentIntent(intentID)
	if err != nil {
		return err
	}

	investmentID, ok := intent.Metadata[InvestmentIDMetadataKey]
	if !ok {
		return fmt.Errorf("investment ID not found in session metadata")
	}

	err = s.repositories.RunInTx(ctx, func(ctx context.Context, tx storage.Transaction) error {
		investmentId, err := strconv.Atoi(investmentID)
		if err != nil {
			return fmt.Errorf("failed to convert investment ID to int: %w", err)
		}

		investmentRecord, err := s.repositories.Investment().GetById(ctx, investmentId)
		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				return fmt.Errorf("investment not found")
			}
			return fmt.Errorf("failed to get investment: %w", err)
		}

		payment, err := s.repositories.Investment().GetPayment(ctx, investmentRecord.ID)
		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				return fmt.Errorf("no payment found for intent ID")
			}
			return fmt.Errorf("failed to get payment: %w", err)
		}

		if payment.RoundInvestmentID != investmentRecord.ID {
			return fmt.Errorf("payment does not match investment")
		}

		updateParams := investment.UpdateRoundInvestmentPaymentParams{
			// Status is updated to success as this is intended to be the final step - if desired we can delay this step
			Status: intent.Status,
		}

		_, err = s.repositories.Investment().UpdatePayment(ctx, payment.RoundInvestmentID, updateParams)
		if err != nil {
			return fmt.Errorf("failed to update investment: %w", err)
		}

		//TODO: update round state

		return nil
	})

	return err
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

func (s *BillingService) getStripePaymentIntent(intentID string) (*stripe.PaymentIntent, error) {
	stripe.Key = s.stripeAPIKey
	return paymentintent.Get(intentID, nil)
}
