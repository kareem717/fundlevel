package round

import (
	"context"

	"fundlevel/internal/entities/round"
	"fundlevel/internal/storage/postgres/shared"
)

func (s *RoundService) GetFixedTotalById(ctx context.Context, id int) (round.FixedTotalRound, error) {
	return s.repositories.Round().GetFixedTotalRoundById(ctx, id)
}

func (s *RoundService) GetFixedTotalRoundsByCursor(ctx context.Context, limit int, cursor int) ([]round.FixedTotalRound, error) {
	paginationParams := shared.CursorPagination{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Round().GetFixedTotalRoundsByCursor(ctx, paginationParams)
}

func (s *RoundService) GetFixedTotalRoundsByPage(ctx context.Context, pageSize int, page int) ([]round.FixedTotalRound, error) {
	paginationParams := shared.OffsetPagination{
		PageSize: pageSize,
		Page:     page,
	}

	return s.repositories.Round().GetFixedTotalRoundsByPage(ctx, paginationParams)
}

func (s *RoundService) CreateFixedTotalRound(ctx context.Context, params round.CreateFixedTotalRoundParams) (round.FixedTotalRound, error) {
	return s.repositories.Round().CreateFixedTotalRound(ctx, params)
}

func (s *RoundService) DeleteFixedTotalRound(ctx context.Context, id int) error {
	return s.repositories.Round().DeleteFixedTotalRound(ctx, id)
}
