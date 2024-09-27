package venture

import (
	"context"

	"fundlevel/internal/entities/round"
	"fundlevel/internal/storage/postgres/shared"
)

func (s *VentureService) GetPartialTotalRoundsByCursor(ctx context.Context, id int, limit int, cursor int) ([]round.PartialTotalRound, error) {
	paginationParams := shared.CursorPagination{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Venture().GetPartialTotalRoundsByCursor(ctx, id, paginationParams)
}

func (s *VentureService) GetPartialTotalRoundsByPage(ctx context.Context, id int, pageSize int, page int) ([]round.PartialTotalRound, error) {
	paginationParams := shared.OffsetPagination{
		PageSize: pageSize,
		Page:     page,
	}

	return s.repositories.Venture().GetPartialTotalRoundsByPage(ctx, id, paginationParams)
}
