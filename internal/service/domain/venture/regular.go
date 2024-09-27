package venture

import (
	"context"

	"fundlevel/internal/entities/round"
	"fundlevel/internal/storage/postgres/shared"
)

func (s *VentureService) GetRegularDynamicRoundsByCursor(ctx context.Context, id int, limit int, cursor int) ([]round.RegularDynamicRound, error) {
	paginationParams := shared.CursorPagination{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Venture().GetRegularDynamicRoundsByCursor(ctx, id, paginationParams)
}

func (s *VentureService) GetRegularDynamicRoundsByPage(ctx context.Context, id int, pageSize int, page int) ([]round.RegularDynamicRound, error) {
	paginationParams := shared.OffsetPagination{
		PageSize: pageSize,
		Page:     page,
	}

	return s.repositories.Venture().GetRegularDynamicRoundsByPage(ctx, id, paginationParams)
}
