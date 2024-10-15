package storage

import (
	"context"

	"fundlevel/internal/entities/account"
	"fundlevel/internal/entities/business"
	"fundlevel/internal/entities/investment"
	"fundlevel/internal/entities/round"
	"fundlevel/internal/entities/venture"
	"fundlevel/internal/storage/postgres/shared"

	"github.com/google/uuid"
)

type VentureRepository interface {
	Create(ctx context.Context, params venture.CreateVentureParams) (venture.Venture, error)
	Delete(ctx context.Context, id int) error
	GetByCursor(ctx context.Context, paginationParams shared.CursorPagination) ([]venture.Venture, error)
	GetByPage(ctx context.Context, paginationParams shared.OffsetPagination) ([]venture.Venture, error)
	Update(ctx context.Context, id int, params venture.UpdateVentureParams) (venture.Venture, error)
	GetById(ctx context.Context, id int) (venture.Venture, error)

	GetRoundsByCursor(ctx context.Context, ventureId int, paginationParams shared.CursorPagination) ([]round.Round, error)
	GetRoundsByPage(ctx context.Context, ventureId int, paginationParams shared.OffsetPagination) ([]round.Round, error)

	// GetInvestmentsByCursor gets all of the received investments on the rounds related to the venture using cursor pagination
	GetInvestmentsByCursor(ctx context.Context, ventureId int, paginationParams shared.CursorPagination) ([]investment.RoundInvestment, error)
	// GetInvestmentsByPage gets all of the received investments on the rounds related to the venture using offset pagination
	GetInvestmentsByPage(ctx context.Context, ventureId int, paginationParams shared.OffsetPagination) ([]investment.RoundInvestment, error)
}

type RoundRepository interface {
	Create(ctx context.Context, params round.CreateRoundParams) (round.Round, error)
	Delete(ctx context.Context, id int) error
	GetById(ctx context.Context, id int) (round.Round, error)
	GetByCursor(ctx context.Context, paginationParams shared.CursorPagination) ([]round.Round, error)
	GetByPage(ctx context.Context, paginationParams shared.OffsetPagination) ([]round.Round, error)

	// GetInvestmentsByCursor gets all of the investments received on the round using cursor pagination
	GetInvestmentsByCursor(ctx context.Context, roundId int, paginationParams shared.CursorPagination) ([]investment.RoundInvestment, error)
	// GetInvestmentsByPage gets all of the investments received on the round using offset pagination
	GetInvestmentsByPage(ctx context.Context, roundId int, paginationParams shared.OffsetPagination) ([]investment.RoundInvestment, error)
}

type InvestmentRepository interface {
	Create(ctx context.Context, params investment.CreateInvestmentParams) (investment.RoundInvestment, error)
	Delete(ctx context.Context, id int) error
	Update(ctx context.Context, id int, params investment.UpdateInvestmentParams) (investment.RoundInvestment, error)
	GetById(ctx context.Context, id int) (investment.RoundInvestment, error)
	GetByCursor(ctx context.Context, paginationParams shared.CursorPagination) ([]investment.RoundInvestment, error)
	GetByPage(ctx context.Context, paginationParams shared.OffsetPagination) ([]investment.RoundInvestment, error)
	GetByRoundIdAndAccountId(ctx context.Context, roundId int, accountId int) (investment.RoundInvestment, error)
}

type AccountRepository interface {
	Create(ctx context.Context, params account.CreateAccountParams) (account.Account, error)
	Delete(ctx context.Context, id int) error
	Update(ctx context.Context, id int, params account.UpdateAccountParams) (account.Account, error)
	GetById(ctx context.Context, id int) (account.Account, error)

	// GetInvestmentsByCursor gets all of the investments the account has made on rounds using cursor pagination
	GetInvestmentsByCursor(ctx context.Context, accountId int, paginationParams shared.CursorPagination) ([]investment.RoundInvestment, error)
	// GetInvestmentsByPage gets all of the investments the account has made on rounds using offset pagination
	GetInvestmentsByPage(ctx context.Context, accountId int, paginationParams shared.OffsetPagination) ([]investment.RoundInvestment, error)
	// IsInvestedInRound checks if the account has made an investment on the round
	IsInvestedInRound(ctx context.Context, accountId int, roundId int) (bool, error)
	GetInvestmentById(ctx context.Context, accountId int, investmentId int) (investment.RoundInvestment, error)

	GetBusinesses(ctx context.Context, accountId int) ([]business.Business, error)
}

type UserRepository interface {
	GetAccount(ctx context.Context, userId uuid.UUID) (account.Account, error)
}

type BusinessRepository interface {
	Create(ctx context.Context, params business.CreateBusinessParams) (business.Business, error)
	GetById(ctx context.Context, id int) (business.Business, error)
	Delete(ctx context.Context, id int) error

	GetVenturesByCursor(ctx context.Context, businessId int, paginationParams shared.CursorPagination) ([]venture.Venture, error)
	GetVenturesByPage(ctx context.Context, businessId int, paginationParams shared.OffsetPagination) ([]venture.Venture, error)

	GetRoundsByPage(ctx context.Context, businessId int, paginationParams shared.OffsetPagination) ([]round.Round, error)
	GetRoundsByCursor(ctx context.Context, businessId int, paginationParams shared.CursorPagination) ([]round.Round, error)

	// GetInvestmentsByCursor gets all of the investments received on the rounds related to the business using cursor pagination
	GetInvestmentsByCursor(ctx context.Context, businessId int, paginationParams shared.CursorPagination) ([]investment.RoundInvestment, error)
	GetInvestmentsByPage(ctx context.Context, businessId int, paginationParams shared.OffsetPagination) ([]investment.RoundInvestment, error)
}

type RepositoryProvider interface {
	Venture() VentureRepository
	Account() AccountRepository
	Round() RoundRepository
	Investment() InvestmentRepository
	User() UserRepository
	Business() BusinessRepository
}

type Transaction interface {
	RepositoryProvider
	Commit() error
	Rollback() error
	SubTransaction() (Transaction, error)
	Business() BusinessRepository
}

type Repository interface {
	RepositoryProvider
	HealthCheck(ctx context.Context) error
	NewTransaction() (Transaction, error)
	RunInTx(ctx context.Context, fn func(ctx context.Context, tx Transaction) error) error
}
