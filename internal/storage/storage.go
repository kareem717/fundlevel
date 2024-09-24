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
	GetMany(ctx context.Context, paginationParams shared.PaginationRequest) ([]venture.Venture, error)
	Update(ctx context.Context, id int, params venture.UpdateVentureParams) (venture.Venture, error)
	GetById(ctx context.Context, id int) (venture.Venture, error)

	// GetRounds gets the total fixed rounds for a venture
	GetRounds(ctx context.Context, ventureId int, paginationParams shared.PaginationRequest) ([]round.Round, error)
}

type RoundRepository interface {
	// Delete deletes a total fixed round by id
	Delete(ctx context.Context, id int) error
	// GetById gets a total fixed round by id
	GetById(ctx context.Context, id int) (round.Round, error)
	// GetMany gets paginated total fixed rounds
	GetMany(ctx context.Context, paginationParams shared.PaginationRequest) ([]round.Round, error)
	// Create creates a total fixed round
	Create(ctx context.Context, params round.CreateRoundParams) (round.Round, error)
}

type AccountRepository interface {
	Create(ctx context.Context, params account.CreateAccountParams) (account.Account, error)
	Delete(ctx context.Context, id int) error
	GetMany(ctx context.Context, paginationParams shared.PaginationRequest) ([]account.Account, error)
	Update(ctx context.Context, id int, params account.UpdateAccountParams) (account.Account, error)
	GetById(ctx context.Context, id int) (account.Account, error)

	GetVentures(ctx context.Context, accountId int, paginationParams shared.PaginationRequest) ([]venture.Venture, error)
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
