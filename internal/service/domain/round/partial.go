package round

import (
	"context"

	"fundlevel/internal/entities/round"
	"fundlevel/internal/storage/postgres/shared"
)

func (s *RoundService) GetPartialTotalById(ctx context.Context, id int) (round.PartialTotalRound, error) {
	return s.repositories.Round().GetPartialTotalRoundById(ctx, id)
}

func (s *RoundService) GetPartialTotalRoundsByCursor(ctx context.Context, limit int, cursor int) ([]round.PartialTotalRound, error) {
	paginationParams := shared.CursorPagination{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Round().GetPartialTotalRoundsByCursor(ctx, paginationParams)
}

func (s *RoundService) GetPartialTotalRoundsByPage(ctx context.Context, pageSize int, page int) ([]round.PartialTotalRound, error) {
	paginationParams := shared.OffsetPagination{
		PageSize: pageSize,
		Page:     page,
	}

	return s.repositories.Round().GetPartialTotalRoundsByPage(ctx, paginationParams)
}

func (s *RoundService) CreatePartialTotalRound(ctx context.Context, params round.CreatePartialTotalRoundParams) (round.PartialTotalRound, error) {
	return s.repositories.Round().CreatePartialTotalRound(ctx, params)
}

func (s *RoundService) DeletePartialTotalRound(ctx context.Context, id int) error {
	return s.repositories.Round().DeletePartialTotalRound(ctx, id)
}
