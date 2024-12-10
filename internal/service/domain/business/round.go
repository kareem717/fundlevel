package business

import (
	"context"

	"fundlevel/internal/entities/round"
	postgres "fundlevel/internal/storage/shared"
)

func (s *BusinessService) GetRoundsByCursor(ctx context.Context, businessId int, limit int, cursor int) ([]round.Round, error) {
	paginationParams := postgres.CursorPagination{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Business().GetRoundsByCursor(ctx, businessId, paginationParams)
}

func (s *BusinessService) GetRoundsByPage(ctx context.Context, businessId int, pageSize int, page int) ([]round.Round, int, error) {
	paginationParams := postgres.OffsetPagination{
		PageSize: pageSize,
		Page:     page,
	}

	return s.repositories.Business().GetRoundsByPage(ctx, businessId, paginationParams)
}
