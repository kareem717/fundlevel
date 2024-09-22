package account

import (
	"context"

	"fundlevel/internal/entities/account"
	"fundlevel/internal/storage"
	"fundlevel/internal/storage/postgres/shared"
)

type AccountService struct {
	repositories storage.Repository
}

// NewTestService returns a new instance of test service.
func NewAccountService(repositories storage.Repository) *AccountService {
	return &AccountService{
		repositories: repositories,
	}
}

func (s *AccountService) GetById(ctx context.Context, id int) (account.Account, error) {
	return s.repositories.Account().GetById(ctx, id)
}

func (s *AccountService) GetMany(ctx context.Context, limit int, cursor int) ([]account.Account, error) {
	paginationParams := shared.PaginationRequest{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Account().GetMany(ctx, paginationParams)
}

func (s *AccountService) Create(ctx context.Context, params account.CreateAccountParams) (account.Account, error) {
	return s.repositories.Account().Create(ctx, params)
}

func (s *AccountService) Delete(ctx context.Context, id int) error {
	return s.repositories.Account().Delete(ctx, id)
}

func (s *AccountService) Update(ctx context.Context, id int, params account.UpdateAccountParams) (account.Account, error) {
	return s.repositories.Account().Update(ctx, id, params)
}
