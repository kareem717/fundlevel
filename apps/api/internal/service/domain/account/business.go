package account

import (
	"context"

	"fundlevel/internal/entities/business"
)

func (s *AccountService) GetAllBusinesses(ctx context.Context, accountId int) ([]business.Business, error) {
	return s.repositories.Account().GetAllBusinesses(ctx, accountId)
}
