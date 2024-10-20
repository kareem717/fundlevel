package venture

import (
	"context"

	"fundlevel/internal/entities/round"
	postgres "fundlevel/internal/storage/shared"
)

func (s *VentureService) GetRoundsByCursor(ctx context.Context, id int, limit int, cursor int) ([]round.Round, error) {
	paginationParams := postgres.CursorPagination{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Venture().GetRoundsByCursor(ctx, id, paginationParams)
}

func (s *VentureService) GetRoundsByPage(ctx context.Context, id int, pageSize int, page int) ([]round.Round, error) {
	paginationParams := postgres.OffsetPagination{
		PageSize: pageSize,
		Page:     page,
	}

	return s.repositories.Venture().GetRoundsByPage(ctx, id, paginationParams)
}

func (s *VentureService) HasActiveRound(ctx context.Context, id int) (bool, error) {
	return s.repositories.Venture().HasActiveRound(ctx, id)
}

func (s *VentureService) GetActiveRound(ctx context.Context, id int) (round.Round, error) {
	return s.repositories.Venture().GetActiveRound(ctx, id)
}
