package account

import (
	"context"

	"fundlevel/internal/entities/round"
	"fundlevel/internal/storage/postgres/shared"
)

func (s *AccountService) GetRoundsByFilterAndCursor(ctx context.Context, accountId int, filter round.RoundFilter, limit int, cursor int) ([]round.RoundWithSubtypes, error) {
	paginationParams := shared.CursorPagination{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Account().GetRoundsByFilterAndCursor(ctx, accountId, filter, paginationParams)
}
