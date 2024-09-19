package user

import (
	"context"

	"fundlevel/internal/entities/account"
	"fundlevel/internal/storage"

	"github.com/google/uuid"
)

type UserService struct {
	repositories storage.Repository
}

func NewUserService(repositories storage.Repository) *UserService {
	return &UserService{
		repositories: repositories,
	}
}
func (s *UserService) GetAccount(ctx context.Context, userId uuid.UUID) (account.Account, error) {
	return s.repositories.User().GetAccount(ctx, userId)
}
