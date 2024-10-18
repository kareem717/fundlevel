package business

import (
	"context"

	"fundlevel/internal/entities/venture"
	"fundlevel/internal/storage/postgres/shared"
)

func (s *BusinessService) GetVenturesByCursor(ctx context.Context, businessId int, limit int, cursor int) ([]venture.Venture, error) {
	paginationParams := shared.CursorPagination{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Business().GetVenturesByCursor(ctx, businessId, paginationParams)
}

func (s *BusinessService) GetVenturesByPage(ctx context.Context, businessId int, pageSize int, page int) ([]venture.Venture, int, error) {
	paginationParams := shared.OffsetPagination{
		PageSize: pageSize,
		Page:     page,
	}

	return s.repositories.Business().GetVenturesByPage(ctx, businessId, paginationParams)
}
