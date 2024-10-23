package business

import (
	"context"

	"fundlevel/internal/entities/business"
	"fundlevel/internal/service/domain/billing"
	"fundlevel/internal/storage"
)

type BusinessService struct {
	repositories   storage.Repository
	billingService *billing.BillingService
}

// NewBusinessService returns a new instance of business service.
func NewBusinessService(repositories storage.Repository, billingService *billing.BillingService) *BusinessService {
	return &BusinessService{
		repositories:   repositories,
		billingService: billingService,
	}
}

func (s *BusinessService) Create(ctx context.Context, params business.CreateBusinessParams) (business.Business, error) {
	params.Business.Status = business.BusinessStatusPending
	resp := business.Business{}

	err := s.repositories.RunInTx(ctx, func(ctx context.Context, tx storage.Transaction) error {
		stripeConnectedAccount, err := s.billingService.CreateStripeConnectedAccount(ctx)
		if err != nil {
			return err
		}

		params.Business.StripeConnectedAccountID = stripeConnectedAccount.ID

		// TODO: We need to delete the stripe connected account if the business creation fails
		business, err := s.repositories.Business().Create(ctx, params)
		if err != nil {
			return err
		}
		resp = business

		return nil
	})

	return resp, err
}

func (s *BusinessService) Delete(ctx context.Context, id int) error {
	return s.repositories.Business().Delete(ctx, id)
}

func (s *BusinessService) GetById(ctx context.Context, id int) (business.Business, error) {
	return s.repositories.Business().GetById(ctx, id)
}
