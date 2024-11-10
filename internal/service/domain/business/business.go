package business

import (
	"context"

	"fundlevel/internal/entities/business"
	"fundlevel/internal/storage"
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
		stripeConnectedAccount, err := s.CreateStripeConnectedAccount(ctx)
		if err != nil {
			return err
		}

		params.Business.StripeConnectedAccountID = stripeConnectedAccount.ID

		// TODO: We need to delete the stripe connected account if the business creation fails
		business, err := tx.Business().Create(ctx, params)
		if err != nil {
			return err
		}
		resp = business

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

		return s.DeleteStripeConnectedAccount(ctx, business.StripeConnectedAccountID)
	})
}

func (s *BusinessService) GetById(ctx context.Context, id int) (business.Business, error) {
	return s.repositories.Business().GetById(ctx, id)
}

func (s *BusinessService) GetByStripeConnectedAccountId(ctx context.Context, stripeConnectedAccountId string) (business.Business, error) {
	return s.repositories.Business().GetByStripeConnectedAccountId(ctx, stripeConnectedAccountId)
}

func (s *BusinessService) Update(ctx context.Context, id int, params business.UpdateBusinessParams) (business.Business, error) {
	return s.repositories.Business().Update(ctx, id, params)
}

func (s *BusinessService) GetStripeDashboardURL(ctx context.Context, businessId int) (string, error) {
	business, err := s.repositories.Business().GetById(ctx, businessId)
	if err != nil {
		return "", err
	}

	return s.GetStripeConnectedAccountDashboardURL(ctx, business.StripeConnectedAccountID)
}
