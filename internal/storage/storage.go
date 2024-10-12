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
	GetManyByCursor(ctx context.Context, paginationParams shared.CursorPagination) ([]venture.Venture, error)
	GetManyByPage(ctx context.Context, paginationParams shared.OffsetPagination) ([]venture.Venture, error)
	Update(ctx context.Context, id int, params venture.UpdateVentureParams) (venture.Venture, error)
	GetById(ctx context.Context, id int) (venture.Venture, error)

	GetRoundsByCursor(ctx context.Context, ventureId int, paginationParams shared.CursorPagination) ([]round.RoundWithSubtypes, error)
	GetRoundsByPage(ctx context.Context, ventureId int, paginationParams shared.OffsetPagination) ([]round.RoundWithSubtypes, error)

	GetFixedTotalRoundsByCursor(ctx context.Context, ventureId int, paginationParams shared.CursorPagination) ([]round.FixedTotalRound, error)
	GetFixedTotalRoundsByPage(ctx context.Context, ventureId int, paginationParams shared.OffsetPagination) ([]round.FixedTotalRound, error)

	GetRegularDynamicRoundsByCursor(ctx context.Context, ventureId int, paginationParams shared.CursorPagination) ([]round.RegularDynamicRound, error)
	GetRegularDynamicRoundsByPage(ctx context.Context, ventureId int, paginationParams shared.OffsetPagination) ([]round.RegularDynamicRound, error)

	GetPartialTotalRoundsByCursor(ctx context.Context, ventureId int, paginationParams shared.CursorPagination) ([]round.PartialTotalRound, error)
	GetPartialTotalRoundsByPage(ctx context.Context, ventureId int, paginationParams shared.OffsetPagination) ([]round.PartialTotalRound, error)

	GetDutchDynamicRoundsByCursor(ctx context.Context, ventureId int, paginationParams shared.CursorPagination) ([]round.DutchDynamicRound, error)
	GetDutchDynamicRoundsByPage(ctx context.Context, ventureId int, paginationParams shared.OffsetPagination) ([]round.DutchDynamicRound, error)

	GetVentureRoundInvestmentsByCursor(ctx context.Context, ventureId int, paginationParams shared.CursorPagination) ([]investment.RoundInvestment, error)
	GetVentureRoundInvestmentsByPage(ctx context.Context, ventureId int, paginationParams shared.OffsetPagination) ([]investment.RoundInvestment, error)
}

type RoundRepository interface {
	Delete(ctx context.Context, id int) error
	GetById(ctx context.Context, id int) (round.RoundWithSubtypes, error)
	GetByCursor(ctx context.Context, paginationParams shared.CursorPagination) ([]round.RoundWithSubtypes, error)
	GetByPage(ctx context.Context, paginationParams shared.OffsetPagination) ([]round.RoundWithSubtypes, error)

	DeleteFixedTotalRound(ctx context.Context, id int) error
	GetFixedTotalRoundById(ctx context.Context, id int) (round.FixedTotalRound, error)
	GetFixedTotalRoundsByCursor(ctx context.Context, paginationParams shared.CursorPagination) ([]round.FixedTotalRound, error)
	GetFixedTotalRoundsByPage(ctx context.Context, paginationParams shared.OffsetPagination) ([]round.FixedTotalRound, error)
	CreateFixedTotalRound(ctx context.Context, params round.CreateFixedTotalRoundParams) (round.FixedTotalRound, error)

	DeleteRegularDynamicRound(ctx context.Context, id int) error
	GetRegularDynamicRoundById(ctx context.Context, id int) (round.RegularDynamicRound, error)
	GetRegularDynamicRoundsByCursor(ctx context.Context, paginationParams shared.CursorPagination) ([]round.RegularDynamicRound, error)
	GetRegularDynamicRoundsByPage(ctx context.Context, paginationParams shared.OffsetPagination) ([]round.RegularDynamicRound, error)
	CreateRegularDynamicRound(ctx context.Context, params round.CreateRegularDynamicRoundParams) (round.RegularDynamicRound, error)

	DeletePartialTotalRound(ctx context.Context, id int) error
	GetPartialTotalRoundById(ctx context.Context, id int) (round.PartialTotalRound, error)
	GetPartialTotalRoundsByCursor(ctx context.Context, paginationParams shared.CursorPagination) ([]round.PartialTotalRound, error)
	GetPartialTotalRoundsByPage(ctx context.Context, paginationParams shared.OffsetPagination) ([]round.PartialTotalRound, error)
	CreatePartialTotalRound(ctx context.Context, params round.CreatePartialTotalRoundParams) (round.PartialTotalRound, error)

	DeleteDutchDynamicRound(ctx context.Context, id int) error
	GetDutchDynamicRoundById(ctx context.Context, id int) (round.DutchDynamicRound, error)
	GetDutchDynamicRoundsByCursor(ctx context.Context, paginationParams shared.CursorPagination) ([]round.DutchDynamicRound, error)
	GetDutchDynamicRoundsByPage(ctx context.Context, paginationParams shared.OffsetPagination) ([]round.DutchDynamicRound, error)
	CreateDutchDynamicRound(ctx context.Context, params round.CreateDutchDynamicRoundParams) (round.DutchDynamicRound, error)

	GetRoundInvestmentsByCursor(ctx context.Context, roundId int, paginationParams shared.CursorPagination) ([]investment.RoundInvestment, error)
	GetRoundInvestmentsByPage(ctx context.Context, roundId int, paginationParams shared.OffsetPagination) ([]investment.RoundInvestment, error)
}

type InvestmentRepository interface {
	Create(ctx context.Context, params investment.CreateInvestmentParams) (investment.RoundInvestment, error)
	Delete(ctx context.Context, id int) error
	GetById(ctx context.Context, id int) (investment.RoundInvestment, error)
	GetByCursor(ctx context.Context, paginationParams shared.CursorPagination) ([]investment.RoundInvestment, error)
	GetByPage(ctx context.Context, paginationParams shared.OffsetPagination) ([]investment.RoundInvestment, error)
	Update(ctx context.Context, id int, params investment.UpdateInvestmentParams) (investment.RoundInvestment, error)
	GetByRoundIdAndAccountId(ctx context.Context, roundId int, accountId int) (investment.RoundInvestment, error)
}

type AccountRepository interface {
	Create(ctx context.Context, params account.CreateAccountParams) (account.Account, error)
	Delete(ctx context.Context, id int) error
	Update(ctx context.Context, id int, params account.UpdateAccountParams) (account.Account, error)
	GetById(ctx context.Context, id int) (account.Account, error)

	GetRoundInvestmentsByCursor(ctx context.Context, accountId int, paginationParams shared.CursorPagination) ([]investment.RoundInvestment, error)
	GetRoundInvestmentsByPage(ctx context.Context, accountId int, paginationParams shared.OffsetPagination) ([]investment.RoundInvestment, error)
	IsInvestedInRound(ctx context.Context, accountId int, roundId int) (bool, error)

	GetBusinessesByPage(ctx context.Context, accountId int, paginationParams shared.OffsetPagination) ([]business.Business, error)
}

type UserRepository interface {
	GetAccount(ctx context.Context, userId uuid.UUID) (account.Account, error)
}

type BusinessRepository interface {
	Create(ctx context.Context, params business.CreateBusinessParams) (business.Business, error)
	GetById(ctx context.Context, id int) (business.Business, error)
	Delete(ctx context.Context, id int) error

	CreateMember(ctx context.Context, params business.CreateBusinessMemberParams) (business.BusinessMember, error)
	DeleteMember(ctx context.Context, businessId int, accountId int) error
	UpdateMember(ctx context.Context, businessId int, accountId int, params business.UpdateBusinessMemberParams) (business.BusinessMember, error)
	GetMembersByPage(ctx context.Context, businessId int, paginationParams shared.OffsetPagination) ([]business.BusinessMember, error)

	GetVenturesByCursor(ctx context.Context, businessId int, paginationParams shared.CursorPagination) ([]venture.Venture, error)
	GetVenturesByPage(ctx context.Context, businessId int, paginationParams shared.OffsetPagination) ([]venture.Venture, error)

	GetRecievedRoundInvestmentsByCursor(ctx context.Context, businessId int, paginationParams shared.CursorPagination) ([]investment.RoundInvestment, error)
	GetRoundsByFilterAndCursor(ctx context.Context, businessId int, filter round.RoundFilter, paginationParams shared.CursorPagination) ([]round.RoundWithSubtypes, error)
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
