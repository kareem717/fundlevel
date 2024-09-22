package venture

import (
	"context"

	"fundlevel/internal/entities/venture"
	"fundlevel/internal/storage"
	"fundlevel/internal/storage/postgres/shared"
)

type VentureService struct {
	repositories storage.Repository
}

// NewTestService returns a new instance of test service.
func NewVentureService(repositories storage.Repository) *VentureService {
	return &VentureService{
		repositories: repositories,
	}
}

func (s *VentureService) GetById(ctx context.Context, id int) (venture.Venture, error) {
	return s.repositories.Venture().GetById(ctx, id)
}

func (s *VentureService) GetMany(ctx context.Context, limit int, cursor int) ([]venture.Venture, error) {
	paginationParams := shared.PaginationRequest{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Venture().GetMany(ctx, paginationParams)
}

func (s *VentureService) Create(ctx context.Context, params venture.CreateVentureParams) (venture.Venture, error) {
	return s.repositories.Venture().Create(ctx, params)
}

func (s *VentureService) Delete(ctx context.Context, id int) error {
	return s.repositories.Venture().Delete(ctx, id)
}

func (s *VentureService) Update(ctx context.Context, id int, params venture.UpdateVentureParams) (venture.Venture, error) {
	return s.repositories.Venture().Update(ctx, id, params)
}
