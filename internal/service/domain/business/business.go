package business

import (
	"context"

	"fundlevel/internal/entities/business"
	"fundlevel/internal/storage"
)

type BusinessService struct {
	repositories storage.Repository
}

// NewBusinessService returns a new instance of business service.
func NewBusinessService(repositories storage.Repository) *BusinessService {
	return &BusinessService{
		repositories: repositories,
	}
}

func (s *BusinessService) Create(ctx context.Context, params business.CreateBusinessParams) (business.Business, error) {
	params.Business.Status = business.BusinessStatusPending
	return s.repositories.Business().Create(ctx, params)
}

func (s *BusinessService) Delete(ctx context.Context, id int) error {
	return s.repositories.Business().Delete(ctx, id)
}

func (s *BusinessService) GetById(ctx context.Context, id int) (business.Business, error) {
	return s.repositories.Business().GetById(ctx, id)
}
