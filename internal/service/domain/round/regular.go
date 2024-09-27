package round

import (
	"context"

	"fundlevel/internal/entities/round"
	"fundlevel/internal/storage/postgres/shared"
)

func (s *RoundService) GetRegularDynamicById(ctx context.Context, id int) (round.RegularDynamicRound, error) {
	return s.repositories.Round().GetRegularDynamicRoundById(ctx, id)
}

func (s *RoundService) GetRegularDynamicRoundsByCursor(ctx context.Context, limit int, cursor int) ([]round.RegularDynamicRound, error) {
	paginationParams := shared.CursorPagination{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Round().GetRegularDynamicRoundsByCursor(ctx, paginationParams)
}

func (s *RoundService) GetRegularDynamicRoundsByPage(ctx context.Context, pageSize int, page int) ([]round.RegularDynamicRound, error) {
	paginationParams := shared.OffsetPagination{
		PageSize: pageSize,
		Page:     page,
	}

	return s.repositories.Round().GetRegularDynamicRoundsByPage(ctx, paginationParams)
}

func (s *RoundService) CreateRegularDynamicRound(ctx context.Context, params round.CreateRegularDynamicRoundParams) (round.RegularDynamicRound, error) {
	return s.repositories.Round().CreateRegularDynamicRound(ctx, params)
}

func (s *RoundService) DeleteRegularDynamicRound(ctx context.Context, id int) error {
	return s.repositories.Round().DeleteRegularDynamicRound(ctx, id)
}
