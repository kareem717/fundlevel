package account

import (
	"context"

	"fundlevel/internal/entities/business"
)

func (s *AccountService) GetBusinesses(ctx context.Context, accountId int) ([]business.Business, error) {
	return s.repositories.Account().GetBusinesses(ctx, accountId)
}
