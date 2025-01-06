package user

import (
	"context"

	"fundlevel/internal/entities/account"

	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type UserRepository struct {
	db  bun.IDB
	ctx context.Context
}

// NewUserRepository returns a new instance of the repository.
func NewUserRepository(db bun.IDB, ctx context.Context) *UserRepository {
	return &UserRepository{
		db:  db,
		ctx: ctx,
	}
}

func (r *UserRepository) GetAccount(ctx context.Context, userId uuid.UUID) (account.Account, error) {
	resp := account.Account{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Where("user_id = ?", userId).
		Scan(ctx)

	return resp, err
}
