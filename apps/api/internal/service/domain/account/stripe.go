package account

import (
	"context"
	"fundlevel/internal/entities/account"
	"fundlevel/internal/service/types"
	"strconv"

	"github.com/stripe/stripe-go/v81"
	"github.com/stripe/stripe-go/v81/identity/verificationsession"
)

func (s *AccountService) CreateStripeIdentity(ctx context.Context, accountID int, params account.CreateStripeIdentityParams) (account.StripeIdentity, error) {
	return s.repositories.Account().CreateStripeIdentity(ctx, accountID, params)
}

func (s *AccountService) DeleteStripeIdentity(ctx context.Context, accountID int) error {
	return s.repositories.Account().DeleteStripeIdentity(ctx, accountID)
}

func (s *AccountService) GetStripeIdentity(ctx context.Context, accountID int) (account.StripeIdentity, error) {
	return s.repositories.Account().GetStripeIdentity(ctx, accountID)
}

func (s *AccountService) GetStripeIdentityVerificationSessionURL(ctx context.Context, accountID int, returnURL string) (types.StripeSessionOutput, error) {
	stripe.Key = s.stripeAPIKey
	
	result := types.StripeSessionOutput{}

	// Create the session
	params := &stripe.IdentityVerificationSessionParams{
		Type:              stripe.String(string(stripe.IdentityVerificationSessionTypeDocument)),
		ClientReferenceID: stripe.String(strconv.Itoa(accountID)),
		ReturnURL:         stripe.String(returnURL),
	}

	vs, err := verificationsession.New(params)
	if err != nil {
		return result, err
	}

	// Return only the session URL to the frontend.
	result.URL = vs.URL
	result.ClientSecret = vs.ClientSecret

	return result, nil
}
