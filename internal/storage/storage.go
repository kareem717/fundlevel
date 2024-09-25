package storage

import (
	"context"

	"fundlevel/internal/entities/account"
	"fundlevel/internal/entities/round"
	"fundlevel/internal/entities/venture"
	"fundlevel/internal/storage/postgres/shared"

	"github.com/google/uuid"
)

type VentureRepository interface {
	Create(ctx context.Context, params venture.CreateVentureParams) (venture.Venture, error)
	Delete(ctx context.Context, id int) error
	GetManyByCursor(ctx context.Context, paginationParams shared.CursorPagination) ([]venture.Venture, error)
	GetManyByPage(ctx context.Context, paginationParams shared.OffsetPagination) ([]venture.Venture, error)
	Update(ctx context.Context, id int, params venture.UpdateVentureParams) (venture.Venture, error)
	GetById(ctx context.Context, id int) (venture.Venture, error)

	GetFixedTotalRoundsByCursor(ctx context.Context, ventureId int, paginationParams shared.CursorPagination) ([]round.FixedTotalRound, error)
	GetFixedTotalRoundsByPage(ctx context.Context, ventureId int, paginationParams shared.OffsetPagination) ([]round.FixedTotalRound, error)
}

type RoundRepository interface {
	DeleteFixedTotalRound(ctx context.Context, id int) error
	GetFixedTotalRoundById(ctx context.Context, id int) (round.FixedTotalRound, error)
	GetFixedTotalRoundsByCursor(ctx context.Context, paginationParams shared.CursorPagination) ([]round.FixedTotalRound, error)
	GetFixedTotalRoundsByPage(ctx context.Context, paginationParams shared.OffsetPagination) ([]round.FixedTotalRound, error)
	CreateFixedTotalRound(ctx context.Context, params round.CreateFixedTotalRoundParams) (round.FixedTotalRound, error)
}

type AccountRepository interface {
	Create(ctx context.Context, params account.CreateAccountParams) (account.Account, error)
	Delete(ctx context.Context, id int) error
	Update(ctx context.Context, id int, params account.UpdateAccountParams) (account.Account, error)
	GetById(ctx context.Context, id int) (account.Account, error)

	GetVenturesByCursor(ctx context.Context, accountId int, paginationParams shared.CursorPagination) ([]venture.Venture, error)
	GetVenturesByPage(ctx context.Context, accountId int, paginationParams shared.OffsetPagination) ([]venture.Venture, error)
}

type UserRepository interface {
	GetAccount(ctx context.Context, userId uuid.UUID) (account.Account, error)
}

type RepositoryProvider interface {
	Venture() VentureRepository
	Account() AccountRepository
	Round() RoundRepository
	User() UserRepository
}

type Transaction interface {
	RepositoryProvider
	Commit() error
	Rollback() error
	SubTransaction() (Transaction, error)
}

type Repository interface {
	RepositoryProvider
	HealthCheck(ctx context.Context) error
	NewTransaction() (Transaction, error)
	RunInTx(ctx context.Context, fn func(ctx context.Context, tx Transaction) error) error
}
