package venture

import (
	"context"

	"fundlevel/internal/entities/round"
	"fundlevel/internal/storage/postgres/shared"
)

func (s *VentureService) GetDutchDynamicRoundsByCursor(ctx context.Context, id int, limit int, cursor int) ([]round.DutchDynamicRound, error) {
	paginationParams := shared.CursorPagination{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Venture().GetDutchDynamicRoundsByCursor(ctx, id, paginationParams)
}

func (s *VentureService) GetDutchDynamicRoundsByPage(ctx context.Context, id int, pageSize int, page int) ([]round.DutchDynamicRound, error) {
	paginationParams := shared.OffsetPagination{
		PageSize: pageSize,
		Page:     page,
	}

	return s.repositories.Venture().GetDutchDynamicRoundsByPage(ctx, id, paginationParams)
}
