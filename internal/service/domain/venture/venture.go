package venture

import (
	"context"

	"fundlevel/internal/entities/venture"
	"fundlevel/internal/storage"
	postgres "fundlevel/internal/storage/shared"
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

func (s *VentureService) GetByCursor(ctx context.Context, limit int, cursor int, filter venture.VentureFilter) ([]venture.Venture, error) {
	paginationParams := postgres.CursorPagination{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Venture().GetByCursor(ctx, paginationParams, filter)
}

func (s *VentureService) GetByPage(ctx context.Context, pageSize int, page int, filter venture.VentureFilter) ([]venture.Venture, int, error) {
	paginationParams := postgres.OffsetPagination{
		PageSize: pageSize,
		Page:     page,
	}

	return s.repositories.Venture().GetByPage(ctx, paginationParams, filter)
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
