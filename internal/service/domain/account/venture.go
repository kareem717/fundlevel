package account

import (
	"context"

	"fundlevel/internal/entities/venture"
	"fundlevel/internal/storage/postgres/shared"
)

func (s *AccountService) GetVentures(ctx context.Context, accountId int, limit int, cursor int) ([]venture.Venture, error) {
	paginationParams := shared.PaginationRequest{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Account().GetVentures(ctx, accountId, paginationParams)
}
