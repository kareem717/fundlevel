package business

import (
	"context"
	"fmt"
	"fundlevel/internal/entities/business"
	"fundlevel/internal/service/types"

	"github.com/stripe/stripe-go/v81"
	"github.com/stripe/stripe-go/v81/account"
	"github.com/stripe/stripe-go/v81/accountlink"
	"github.com/stripe/stripe-go/v81/loginlink"
)

// CreateAccountLink creates a new on boarding session for a Stripe Connect connected account
func (s *BusinessService) CreateStripeAccountLink(ctx context.Context, accountID string, returnURL string, refreshURL string) (types.URLField, error) {
	stripe.Key = s.stripeAPIKey
	resp := types.URLField{}

	account, err := account.GetByID(accountID, nil)
	if err != nil {
		return resp, err
	}

	if account == nil {
		return resp, fmt.Errorf("account is not connected to Stripe Connect")
	}

	accountLink, err := accountlink.New(&stripe.AccountLinkParams{
		Account:    stripe.String(account.ID),
		ReturnURL:  stripe.String(returnURL),
		RefreshURL: stripe.String(refreshURL),
		Type:       stripe.String("account_onboarding"),
	})
	if err != nil {
		return resp, err
	}

	resp.URL = accountLink.URL

	return resp, nil
}

func (s *BusinessService) GetStripeConnectedAccountDashboardURL(ctx context.Context, accountID string) (types.URLField, error) {
	stripe.Key = s.stripeAPIKey
	resp := types.URLField{}

	account, err := account.GetByID(accountID, nil)
	if err != nil {
		return resp, err
	}

	params := &stripe.LoginLinkParams{
		Account: stripe.String(account.ID),
	}
	result, err := loginlink.New(params)
	if err != nil {
		return resp, err
	}

	resp.URL = result.URL

	return resp, nil
}

func (s *BusinessService) DeleteStripeConnectedAccount(ctx context.Context, accountID string) error {
	stripe.Key = s.stripeAPIKey

	_, err := account.Del(accountID, nil)
	if err != nil {
		return err
	}

	return nil
}

func (s *BusinessService) GetStripeAccountByAccountId(ctx context.Context, accountId string) (business.BusinessStripeAccount, error) {
	return s.repositories.Business().GetStripeAccountByAccountId(ctx, accountId)
}

func (s *BusinessService) UpdateStripeAccount(ctx context.Context, businessId int, params business.UpdateBusinessStripeAccountParams) (business.BusinessStripeAccount, error) {
	return s.repositories.Business().UpdateStripeAccount(ctx, businessId, params)
}

func (s *BusinessService) GetStripeDashboardURL(ctx context.Context, businessId int) (types.URLField, error) {
	resp := types.URLField{}

	business, err := s.repositories.Business().GetById(ctx, businessId)
	if err != nil {
		return resp, err
	}

	dashboardURL, err := s.GetStripeConnectedAccountDashboardURL(ctx, business.StripeAccount.StripeConnectedAccountID)
	if err != nil {
		return resp, err
	}

	resp.URL = dashboardURL.URL

	return resp, nil
}

func (s *BusinessService) GetStripeAccount(ctx context.Context, businessId int) (business.BusinessStripeAccount, error) {
	return s.repositories.Business().GetStripeAccount(ctx, businessId)
}
