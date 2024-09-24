package account

import (
	"context"

	"fundlevel/internal/entities/venture"
	"fundlevel/internal/storage/postgres/shared"
)

func (s *AccountService) GetVenturesByCursor(ctx context.Context, accountId int, limit int, cursor int) ([]venture.Venture, error) {
	paginationParams := shared.CursorPagination{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Account().GetVenturesByCursor(ctx, accountId, paginationParams)
}

func (s *AccountService) GetVenturesByPage(ctx context.Context, accountId int, pageSize int, page int) ([]venture.Venture, error) {
	paginationParams := shared.OffsetPagination{
		PageSize: pageSize,
		Page:     page,
	}

	return s.repositories.Account().GetVenturesByPage(ctx, accountId, paginationParams)
}
