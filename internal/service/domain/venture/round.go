package venture

import (
	"context"

	"fundlevel/internal/entities/round"
	"fundlevel/internal/storage/postgres/shared"
)

func (s *VentureService) GetRoundsByCursor(ctx context.Context, id int, limit int, cursor int) ([]round.Round, error) {
	paginationParams := shared.CursorPagination{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Venture().GetRoundsByCursor(ctx, id, paginationParams)
}

func (s *VentureService) GetRoundsByPage(ctx context.Context, id int, pageSize int, page int) ([]round.Round, error) {
	paginationParams := shared.OffsetPagination{
		PageSize: pageSize,
		Page:     page,
	}

	return s.repositories.Venture().GetRoundsByPage(ctx, id, paginationParams)
}
