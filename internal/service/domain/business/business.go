package business

import (
	"context"
	"fmt"
	"math/rand/v2"

	"fundlevel/internal/entities/business"
	"fundlevel/internal/storage"

	"github.com/stripe/stripe-go/v80"
	"github.com/stripe/stripe-go/v80/account"
)

type BusinessService struct {
	repositories storage.Repository
	stripeAPIKey string
}

// NewBusinessService returns a new instance of business service.
func NewBusinessService(repositories storage.Repository, stripeAPIKey string) *BusinessService {
	return &BusinessService{
		repositories: repositories,
		stripeAPIKey: stripeAPIKey,
	}
}

func (s *BusinessService) Create(ctx context.Context, params business.CreateBusinessParams) error {
	params.Business.Status = business.BusinessStatusPending

	err := s.repositories.RunInTx(ctx, func(ctx context.Context, tx storage.Transaction) error {
		stripe.Key = s.stripeAPIKey

		stripeConnectedAccount, err := account.New(&stripe.AccountParams{
			Controller: &stripe.AccountControllerParams{
				StripeDashboard: &stripe.AccountControllerStripeDashboardParams{
					Type: stripe.String("express"),
				},
				Fees: &stripe.AccountControllerFeesParams{
					Payer: stripe.String("application"),
				},
				Losses: &stripe.AccountControllerLossesParams{
					Payments: stripe.String("application"),
				},
			},
			Capabilities: &stripe.AccountCapabilitiesParams{
				Transfers: &stripe.AccountCapabilitiesTransfersParams{Requested: stripe.Bool(true)},
			},
			TOSAcceptance: &stripe.AccountTOSAcceptanceParams{
				ServiceAgreement: stripe.String("full"),
			},
		})
		if err != nil {
			return err
		}

		params.StripeAccount = business.CreateBusinessStripeAccountParams{
			StripeConnectedAccountID: stripeConnectedAccount.ID,
		}

		if stripeConnectedAccount.Capabilities.Transfers == stripe.AccountCapabilityStatusActive {
			params.StripeAccount.StripeTransfersEnabled = true
		}

		if stripeConnectedAccount.PayoutsEnabled {
			params.StripeAccount.StripePayoutsEnabled = true
		}

		if stripeConnectedAccount.Requirements.DisabledReason != "" {
			params.StripeAccount.StripeDisabledReason = &stripeConnectedAccount.Requirements.DisabledReason
		}

		if params.Business.BusinessColour == nil {
			// Generate a random hex colour
			colour := fmt.Sprintf("#%06X", rand.Int64N(0xFFFFFF))
			params.Business.BusinessColour = &colour
		}
		// TODO: We need to delete the stripe connected account if the business creation fails
		err = tx.Business().Create(ctx, params)
		if err != nil {
			return err
		}

		return nil
	})

	return err
}

func (s *BusinessService) Delete(ctx context.Context, id int) error {
	return s.repositories.RunInTx(ctx, func(ctx context.Context, tx storage.Transaction) error {
		business, err := tx.Business().GetById(ctx, id)
		if err != nil {
			return err
		}

		err = tx.Business().Delete(ctx, id)
		if err != nil {
			return err
		}

		err = tx.Business().DeleteStripeAccount(ctx, business.StripeAccount.BusinessID)
		if err != nil {
			return err
		}

		return s.DeleteStripeConnectedAccount(ctx, business.StripeAccount.StripeConnectedAccountID)
	})
}

func (s *BusinessService) GetById(ctx context.Context, id int) (business.Business, error) {
	return s.repositories.Business().GetById(ctx, id)
}

func (s *BusinessService) Update(ctx context.Context, id int, params business.UpdateBusinessParams) (business.Business, error) {
	return s.repositories.Business().Update(ctx, id, params)
}
