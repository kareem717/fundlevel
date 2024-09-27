package round

import (
	"context"

	"fundlevel/internal/entities/round"
	"fundlevel/internal/storage/postgres/shared"
)

func (s *RoundService) GetDutchDynamicById(ctx context.Context, id int) (round.DutchDynamicRound, error) {
	return s.repositories.Round().GetDutchDynamicRoundById(ctx, id)
}

func (s *RoundService) GetDutchDynamicRoundsByCursor(ctx context.Context, limit int, cursor int) ([]round.DutchDynamicRound, error) {
	paginationParams := shared.CursorPagination{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Round().GetDutchDynamicRoundsByCursor(ctx, paginationParams)
}

func (s *RoundService) GetDutchDynamicRoundsByPage(ctx context.Context, pageSize int, page int) ([]round.DutchDynamicRound, error) {
	paginationParams := shared.OffsetPagination{
		PageSize: pageSize,
		Page:     page,
	}

	return s.repositories.Round().GetDutchDynamicRoundsByPage(ctx, paginationParams)
}

func (s *RoundService) CreateDutchDynamicRound(ctx context.Context, params round.CreateDutchDynamicRoundParams) (round.DutchDynamicRound, error) {
	return s.repositories.Round().CreateDutchDynamicRound(ctx, params)
}

func (s *RoundService) DeleteDutchDynamicRound(ctx context.Context, id int) error {
	return s.repositories.Round().DeleteDutchDynamicRound(ctx, id)
}
