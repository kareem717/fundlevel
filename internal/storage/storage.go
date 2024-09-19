package storage

import (
	"context"

	"fundlevel/internal/entities/account"
	"fundlevel/internal/entities/offer"
	"fundlevel/internal/entities/round"
	"fundlevel/internal/entities/venture"
	"fundlevel/internal/storage/postgres/shared"

	"github.com/google/uuid"
)

type VentureRepository interface {
	Create(ctx context.Context, params venture.CreateVentureParams) (venture.Venture, error)
	Delete(ctx context.Context, id int) error
	GetAll(ctx context.Context, paginationParams shared.PaginationRequest) ([]venture.Venture, error)
	Update(ctx context.Context, id int, params venture.UpdateVentureParams) (venture.Venture, error)
	GetById(ctx context.Context, id int) (venture.Venture, error)

	GetRounds(ctx context.Context, ventureId int, paginationParams shared.PaginationRequest) ([]round.Round, error)

	GetOffers(ctx context.Context, ventureId int, paginationParams shared.PaginationRequest) ([]offer.Offer, error)
}

type OfferRepository interface {
	Create(ctx context.Context, params offer.CreateOfferParams) (offer.Offer, error)
	Delete(ctx context.Context, id int) error
	GetAll(ctx context.Context, paginationParams shared.PaginationRequest) ([]offer.Offer, error)
	Update(ctx context.Context, id int, params offer.UpdateOfferParams) (offer.Offer, error)
	GetById(ctx context.Context, id int) (offer.Offer, error)
}

type RoundRepository interface {
	Create(ctx context.Context, params round.CreateRoundParams) (round.Round, error)
	Delete(ctx context.Context, id int) error
	GetAll(ctx context.Context, paginationParams shared.PaginationRequest) ([]round.Round, error)
	Update(ctx context.Context, id int, params round.UpdateRoundParams) (round.Round, error)
	GetById(ctx context.Context, id int) (round.Round, error)

	GetOffers(ctx context.Context, roundId int, paginationParams shared.PaginationRequest) ([]offer.Offer, error)
}

type AccountRepository interface {
	Create(ctx context.Context, params account.CreateAccountParams) (account.Account, error)
	Delete(ctx context.Context, id int) error
	GetAll(ctx context.Context, paginationParams shared.PaginationRequest) ([]account.Account, error)
	Update(ctx context.Context, id int, params account.UpdateAccountParams) (account.Account, error)
	GetById(ctx context.Context, id int) (account.Account, error)
}

type UserRepository interface {
	GetAccount(ctx context.Context, userId uuid.UUID) (account.Account, error)
}

type RepositoryProvider interface {
	Venture() VentureRepository
	Account() AccountRepository
	Round() RoundRepository
	Offer() OfferRepository
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
