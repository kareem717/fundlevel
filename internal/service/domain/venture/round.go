package venture

import (
	"context"

	"fundlevel/internal/entities/round"
	"fundlevel/internal/storage/postgres/shared"
)

func (s *VentureService) GetFixedTotalRoundsByCursor(ctx context.Context, id int, limit int, cursor int) ([]round.FixedTotalRound, error) {
	paginationParams := shared.CursorPagination{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Venture().GetFixedTotalRoundsByCursor(ctx, id, paginationParams)
}

func (s *VentureService) GetFixedTotalRoundsByPage(ctx context.Context, id int, pageSize int, page int) ([]round.FixedTotalRound, error) {
	paginationParams := shared.OffsetPagination{
		PageSize: pageSize,
		Page:     page,
	}

	return s.repositories.Venture().GetFixedTotalRoundsByPage(ctx, id, paginationParams)
}
