package storage

import (
	"context"

	"fundlevel/internal/entities/account"
	"fundlevel/internal/entities/analytic"
	"fundlevel/internal/entities/business"
	"fundlevel/internal/entities/industry"
	"fundlevel/internal/entities/investment"
	"fundlevel/internal/entities/round"
	"fundlevel/internal/entities/venture"
	postgres "fundlevel/internal/storage/shared"

	"github.com/google/uuid"
)

type VentureRepository interface {
	Create(ctx context.Context, params venture.CreateVentureParams) (venture.Venture, error)
	Delete(ctx context.Context, id int) error
	GetByCursor(ctx context.Context, paginationParams postgres.CursorPagination, filter venture.VentureFilter) ([]venture.Venture, error)
	GetByPage(ctx context.Context, paginationParams postgres.OffsetPagination, filter venture.VentureFilter) ([]venture.Venture, int, error)
	Update(ctx context.Context, id int, params venture.UpdateVentureParams) (venture.Venture, error)
	GetById(ctx context.Context, id int) (venture.Venture, error)

	GetRoundsByCursor(ctx context.Context, ventureId int, paginationParams postgres.CursorPagination, filter round.RoundFilter) ([]round.Round, error)
	GetRoundsByPage(ctx context.Context, ventureId int, paginationParams postgres.OffsetPagination, filter round.RoundFilter) ([]round.Round, int, error)
	HasActiveRound(ctx context.Context, ventureId int) (bool, error)
	GetActiveRound(ctx context.Context, ventureId int) (round.Round, error)

	// GetInvestmentsByCursor gets all of the received investments on the rounds related to the venture using cursor pagination
	GetInvestmentsByCursor(ctx context.Context, ventureId int, paginationParams postgres.CursorPagination, filter investment.InvestmentFilter) ([]investment.RoundInvestment, error)
	// GetInvestmentsByPage gets all of the received investments on the rounds related to the venture using offset pagination
	GetInvestmentsByPage(ctx context.Context, ventureId int, paginationParams postgres.OffsetPagination, filter investment.InvestmentFilter) ([]investment.RoundInvestment, int, error)
}

type IndustryRepository interface {
	GetAll(ctx context.Context) ([]industry.Industry, error)
}

type RoundRepository interface {
	Create(ctx context.Context, params round.CreateRoundParams) (round.Round, error)
	Delete(ctx context.Context, id int) error
	GetById(ctx context.Context, id int) (round.Round, error)
	GetByCursor(ctx context.Context, paginationParams postgres.CursorPagination, filter round.RoundFilter) ([]round.Round, error)
	GetByPage(ctx context.Context, paginationParams postgres.OffsetPagination, filter round.RoundFilter) ([]round.Round, int, error)

	// GetInvestmentsByCursor gets all of the investments received on the round using cursor pagination
	GetInvestmentsByCursor(ctx context.Context, roundId int, paginationParams postgres.CursorPagination, filter investment.InvestmentFilter) ([]investment.RoundInvestment, error)
	// GetInvestmentsByPage gets all of the investments received on the round using offset pagination
	GetInvestmentsByPage(ctx context.Context, roundId int, paginationParams postgres.OffsetPagination, filter investment.InvestmentFilter) ([]investment.RoundInvestment, int, error)
}

type InvestmentRepository interface {
	Create(ctx context.Context, params investment.CreateInvestmentParams) (investment.RoundInvestment, error)
	Delete(ctx context.Context, id int) error
	Update(ctx context.Context, id int, params investment.UpdateInvestmentParams) (investment.RoundInvestment, error)
	GetById(ctx context.Context, id int) (investment.RoundInvestment, error)
	GetByCursor(ctx context.Context, paginationParams postgres.CursorPagination, filter investment.InvestmentFilter) ([]investment.RoundInvestment, error)
	GetByPage(ctx context.Context, paginationParams postgres.OffsetPagination, filter investment.InvestmentFilter) ([]investment.RoundInvestment, int, error)
	GetByRoundIdAndAccountId(ctx context.Context, roundId int, accountId int) (investment.RoundInvestment, error)
}

type AccountRepository interface {
	Create(ctx context.Context, params account.CreateAccountParams) (account.Account, error)
	Delete(ctx context.Context, id int) error
	Update(ctx context.Context, id int, params account.UpdateAccountParams) (account.Account, error)
	GetById(ctx context.Context, id int) (account.Account, error)

	// GetInvestmentsByCursor gets all of the investments the account has made on rounds using cursor pagination
	GetInvestmentsByCursor(ctx context.Context, accountId int, paginationParams postgres.CursorPagination, filter investment.InvestmentFilter) ([]investment.RoundInvestment, error)
	// GetInvestmentsByPage gets all of the investments the account has made on rounds using offset pagination
	GetInvestmentsByPage(ctx context.Context, accountId int, paginationParams postgres.OffsetPagination, filter investment.InvestmentFilter) ([]investment.RoundInvestment, int, error)
	// GetRoundInvestment attempts to get an investment on a round made by the account that is not withdrawn
	IsInvestedInRound(ctx context.Context, accountId int, roundId int) (bool, error)
	GetInvestmentById(ctx context.Context, accountId int, investmentId int) (investment.RoundInvestment, error)

	GetAllBusinesses(ctx context.Context, accountId int) ([]business.Business, error)
}

type UserRepository interface {
	GetAccount(ctx context.Context, userId uuid.UUID) (account.Account, error)
}

type BusinessRepository interface {
	Create(ctx context.Context, params business.CreateBusinessParams) (business.Business, error)
	GetById(ctx context.Context, id int) (business.Business, error)
	GetByStripeConnectedAccountId(ctx context.Context, stripeConnectedAccountId string) (business.Business, error)
	Update(ctx context.Context, id int, params business.UpdateBusinessParams) (business.Business, error)
	Delete(ctx context.Context, id int) error

	GetVenturesByCursor(ctx context.Context, businessId int, paginationParams postgres.CursorPagination, filter venture.VentureFilter) ([]venture.Venture, error)
	GetVenturesByPage(ctx context.Context, businessId int, paginationParams postgres.OffsetPagination, filter venture.VentureFilter) ([]venture.Venture, int, error)

	GetRoundsByPage(ctx context.Context, businessId int, paginationParams postgres.OffsetPagination, filter round.RoundFilter) ([]round.Round, int, error)
	GetRoundsByCursor(ctx context.Context, businessId int, paginationParams postgres.CursorPagination, filter round.RoundFilter) ([]round.Round, error)

	// GetInvestmentsByCursor gets all of the investments received on the rounds related to the business using cursor pagination
	GetInvestmentsByCursor(ctx context.Context, businessId int, paginationParams postgres.CursorPagination, filter investment.InvestmentFilter) ([]investment.RoundInvestment, error)
	// GetInvestmentsByPage gets all of the investments received on the rounds related to the business using offset pagination
	GetInvestmentsByPage(ctx context.Context, businessId int, paginationParams postgres.OffsetPagination, filter investment.InvestmentFilter) ([]investment.RoundInvestment, int, error)

	// GetTotalFunding gets the amount the business has successfully raised through rounds
	GetTotalFunding(ctx context.Context, businessId int) (int, error)
}

type FavouriteRepository interface {
	CreateVentureFavourite(ctx context.Context, params analytic.CreateVentureFavouriteParams) error
	DeleteVentureFavourite(ctx context.Context, ventureId int, accountId int) error
	IsVentureFavouritedByAccount(ctx context.Context, ventureId int, accountId int) (bool, error)
	GetVentureFavouriteCount(ctx context.Context, ventureId int) (int, error)

	CreateBusinessFavourite(ctx context.Context, params analytic.CreateBusinessFavouriteParams) error
	DeleteBusinessFavourite(ctx context.Context, businessId int, accountId int) error
	IsBusinessFavouritedByAccount(ctx context.Context, businessId int, accountId int) (bool, error)
	GetBusinessFavouriteCount(ctx context.Context, businessId int) (int, error)

	CreateRoundFavourite(ctx context.Context, params analytic.CreateRoundFavouriteParams) error
	DeleteRoundFavourite(ctx context.Context, roundId int, accountId int) error
	IsRoundFavouritedByAccount(ctx context.Context, roundId int, accountId int) (bool, error)
	GetRoundFavouriteCount(ctx context.Context, roundId int) (int, error)
}

type ImpressionRepository interface {
	CreateRoundImpression(ctx context.Context, params analytic.CreateRoundImpressionParams) error
	CreateVentureImpression(ctx context.Context, params analytic.CreateVentureImpressionParams) error
	CreateBusinessImpression(ctx context.Context, params analytic.CreateBusinessImpressionParams) error

	GetRoundImpressionCount(ctx context.Context, roundId int) (int, error)
	GetVentureImpressionCount(ctx context.Context, ventureId int) (int, error)
	GetBusinessImpressionCount(ctx context.Context, businessId int) (int, error)
}

type RepositoryProvider interface {
	Venture() VentureRepository
	Account() AccountRepository
	Round() RoundRepository
	Investment() InvestmentRepository
	User() UserRepository
	Business() BusinessRepository
	Impression() ImpressionRepository
	Industry() IndustryRepository
	Favourite() FavouriteRepository
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
