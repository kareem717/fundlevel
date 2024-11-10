package business

import (
	"context"
	"fmt"

	"github.com/stripe/stripe-go/v80"
	"github.com/stripe/stripe-go/v80/account"
	"github.com/stripe/stripe-go/v80/accountlink"
	"github.com/stripe/stripe-go/v80/loginlink"
)

// CreateAccountLink creates a new on boarding session for a Stripe Connect connected account
func (s *BusinessService) CreateStripeAccountLink(ctx context.Context, accountID string, returnURL string, refreshURL string) (string, error) {
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

func (s *BusinessService) CreateStripeConnectedAccount(ctx context.Context) (stripe.Account, error) {
	stripe.Key = s.stripeAPIKey

	account, err := account.New(&stripe.AccountParams{})
	if err != nil {
		return stripe.Account{}, err
	}

	return *account, nil
}

func (s *BusinessService) GetStripeConnectedAccountDashboardURL(ctx context.Context, accountID string) (string, error) {
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

func (s *BusinessService) DeleteStripeConnectedAccount(ctx context.Context, accountID string) error {
	stripe.Key = s.stripeAPIKey

	_, err := account.Del(accountID, nil)
	if err != nil {
		return err
	}

	return nil
}
