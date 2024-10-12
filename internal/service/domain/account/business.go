package account

import (
	"context"

	"fundlevel/internal/entities/business"
	"fundlevel/internal/storage/postgres/shared"
)

func (s *AccountService) GetBusinessesByPage(ctx context.Context, accountId int, pageSize int, page int) ([]business.Business, error) {
	paginationParams := shared.OffsetPagination{
		PageSize: pageSize,
		Page:     page,
	}

	return s.repositories.Account().GetBusinessesByPage(ctx, accountId, paginationParams)
}
