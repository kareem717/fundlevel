package business

import (
	"context"

	"fundlevel/internal/entities/round"
	"fundlevel/internal/storage/postgres/shared"
)

func (s *BusinessService) GetRoundsByFilterAndCursor(ctx context.Context, businessId int, filter round.RoundFilter, limit int, cursor int) ([]round.RoundWithSubtypes, error) {
	paginationParams := shared.CursorPagination{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Business().GetRoundsByFilterAndCursor(ctx, businessId, filter, paginationParams)
}
