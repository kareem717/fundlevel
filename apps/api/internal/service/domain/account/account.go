package account

import (
	"context"

	"fundlevel/internal/entities/account"
	"fundlevel/internal/storage"

	"github.com/google/uuid"
)

type AccountService struct {
	repositories storage.Repository
	stripeAPIKey string
}

// NewAccountService returns a new instance of account service.
func NewAccountService(repositories storage.Repository, stripeAPIKey string) *AccountService {
	return &AccountService{
		repositories: repositories,
		stripeAPIKey: stripeAPIKey,
	}
}

func (s *AccountService) GetById(ctx context.Context, id int) (account.Account, error) {
	return s.repositories.Account().GetById(ctx, id)
}

func (s *AccountService) GetByUserId(ctx context.Context, userId uuid.UUID) (account.Account, error) {
	return s.repositories.Account().GetByUserId(ctx, userId)
}

func (s *AccountService) Create(ctx context.Context, params account.CreateAccountParams, userId uuid.UUID) (account.Account, error) {
	return s.repositories.Account().Create(ctx, params, userId)
}

func (s *AccountService) Delete(ctx context.Context, id int) error {
	return s.repositories.Account().Delete(ctx, id)
}

func (s *AccountService) Update(ctx context.Context, id int, params account.UpdateAccountParams) (account.Account, error) {
	return s.repositories.Account().Update(ctx, id, params)
}
