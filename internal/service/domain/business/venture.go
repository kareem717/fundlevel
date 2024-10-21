package business

import (
	"context"

	"fundlevel/internal/entities/venture"
	postgres "fundlevel/internal/storage/shared"
)

func (s *BusinessService) GetVenturesByCursor(ctx context.Context, businessId int, limit int, cursor int, filter venture.VentureFilter) ([]venture.Venture, error) {
	paginationParams := postgres.CursorPagination{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Business().GetVenturesByCursor(ctx, businessId, paginationParams, filter)
}

func (s *BusinessService) GetVenturesByPage(ctx context.Context, businessId int, pageSize int, page int, filter venture.VentureFilter) ([]venture.Venture, int, error) {
	paginationParams := postgres.OffsetPagination{
		PageSize: pageSize,
		Page:     page,
	}

	return s.repositories.Business().GetVenturesByPage(ctx, businessId, paginationParams, filter)
}
