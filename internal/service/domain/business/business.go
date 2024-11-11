package business

import (
	"context"

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

func (s *BusinessService) Create(ctx context.Context, params business.CreateBusinessParams) (business.Business, error) {
	params.Business.Status = business.BusinessStatusPending
	resp := business.Business{}

	err := s.repositories.RunInTx(ctx, func(ctx context.Context, tx storage.Transaction) error {
		stripe.Key = s.stripeAPIKey

		stripeConnectedAccount, err := account.New(&stripe.AccountParams{})
		if err != nil {
			return err
		}
	

		// TODO: We need to delete the stripe connected account if the business creation fails
		businessRecord, err := tx.Business().Create(ctx, params)
		if err != nil {
			return err
		}
		resp = businessRecord

		stripeAccountParams := business.CreateBusinessStripeAccountParams{
			BusinessID:               businessRecord.ID,
			StripeConnectedAccountID: stripeConnectedAccount.ID,
		}

		if stripeConnectedAccount.Capabilities.Transfers == stripe.AccountCapabilityStatusActive {
			stripeAccountParams.StripeTransfersEnabled = true
		}

		if stripeConnectedAccount.PayoutsEnabled {
			stripeAccountParams.StripePayoutsEnabled = true
		}

		if stripeConnectedAccount.Requirements.DisabledReason != "" {
			stripeAccountParams.StripeDisabledReason = &stripeConnectedAccount.Requirements.DisabledReason
		}

		businessStripeAccount, err := tx.Business().CreateStripeAccount(ctx, stripeAccountParams)
		if err != nil {
			return err
		}

		resp.StripeAccount = &businessStripeAccount

		return nil
	})

	return resp, err
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

