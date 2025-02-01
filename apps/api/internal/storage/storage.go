package storage

import (
	"context"

	"fundlevel/internal/entities/account"
	"fundlevel/internal/entities/business"
	"fundlevel/internal/entities/industry"
	"fundlevel/internal/entities/investment"
	"fundlevel/internal/entities/round"
	"fundlevel/internal/storage/shared"

	"github.com/google/uuid"
)

type IndustryRepository interface {
	GetAll(ctx context.Context) ([]industry.Industry, error)
}

type RoundRepository interface {
	Create(ctx context.Context, params round.CreateRoundParams) (round.Round, error)
	Delete(ctx context.Context, id int) error
	GetById(ctx context.Context, id int) (round.Round, error)
	GetByCursor(ctx context.Context, paginationParams shared.CursorPagination) ([]round.Round, error)
	GetByPage(ctx context.Context, paginationParams shared.OffsetPagination) ([]round.Round, int, error)
	Update(ctx context.Context, id int, params round.UpdateRoundParams) (round.Round, error)
	GetAvailableShares(ctx context.Context, id int) (int, error)

	GetTerms(ctx context.Context, id int) (round.RoundTerm, error)
}
type InvestmentRepository interface {
	Create(ctx context.Context, investorId int, usdCentValue int64, params investment.CreateInvestmentParams) (investment.Investment, error)
	Delete(ctx context.Context, id int) error
	GetById(ctx context.Context, id int) (investment.Investment, error)
	GetByCursor(ctx context.Context, paginationParams shared.CursorPagination) ([]investment.Investment, error)
	GetByPage(ctx context.Context, paginationParams shared.OffsetPagination) ([]investment.Investment, int, error)
	GetByRoundIdAndAccountId(ctx context.Context, roundId int, accountId int) (investment.Investment, error)
	Update(ctx context.Context, id int, params investment.UpdateInvestmentParams) (investment.Investment, error)
	CloseIncompleteInvestments(ctx context.Context, roundId int) error

	CreatePayment(ctx context.Context, investmentId int, params investment.CreatePaymentParams) (investment.Payment, error)
	UpdatePayment(ctx context.Context, id int, params investment.UpdatePaymentParams) (investment.Payment, error)
	GetPaymentById(ctx context.Context, id int) (investment.Payment, error)
	GetPaymentByIntentId(ctx context.Context, intentId string) (investment.Payment, error)
	GetPaymentsByInvestmentId(ctx context.Context, investmentId int) ([]investment.Payment, error)
	GetCurrentPayment(ctx context.Context, investmentId int) (investment.Payment, error)
	GetFailedPaymentCount(ctx context.Context, investmentId int) (int, error)
}
type AccountRepository interface {
	Create(ctx context.Context, params account.CreateAccountParams, userId uuid.UUID) (account.Account, error)
	Delete(ctx context.Context, id int) error
	Update(ctx context.Context, id int, params account.UpdateAccountParams) (account.Account, error)
	GetById(ctx context.Context, id int) (account.Account, error)
	GetByUserId(ctx context.Context, userId uuid.UUID) (account.Account, error)

	GetAllBusinesses(ctx context.Context, accountId int) ([]business.Business, error)

	GetStripeIdentity(ctx context.Context, accountId int) (account.StripeIdentity, error)
	DeleteStripeIdentity(ctx context.Context, accountId int) error
	CreateStripeIdentity(ctx context.Context, accountId int, params account.CreateStripeIdentityParams) (account.StripeIdentity, error)
}

type BusinessRepository interface {
	Create(ctx context.Context, params business.CreateBusinessParams, initialOwnerId int) (business.Business, error)
	GetById(ctx context.Context, id int) (business.Business, error)
	Update(ctx context.Context, id int, params business.UpdateBusinessParams) (business.Business, error)
	Delete(ctx context.Context, id int) error
	// GetByStripeConnectedAccountId(ctx context.Context, stripeConnectedAccountId string) (business.Business, error)

	UpsertBusinessLegalSection(ctx context.Context, businessId int, params business.UpsertBusinessLegalSectionParams) error

	GetStripeAccountByAccountId(ctx context.Context, accountId string) (business.BusinessStripeAccount, error)
	UpdateStripeAccount(ctx context.Context, businessId int, params business.UpdateBusinessStripeAccountParams) (business.BusinessStripeAccount, error)
	GetStripeAccount(ctx context.Context, businessId int) (business.BusinessStripeAccount, error)
	DeleteStripeAccount(ctx context.Context, businessId int) error

	GetRoundsByPage(ctx context.Context, businessId int, paginationParams shared.OffsetPagination) ([]round.Round, int, error)
	GetRoundsByCursor(ctx context.Context, businessId int, paginationParams shared.CursorPagination) ([]round.Round, error)

	GetBusinessMember(ctx context.Context, businessId int, accountId int) (business.BusinessMemberWithRole, error)
	GetMembersByPage(ctx context.Context, businessId int, paginationParams shared.OffsetPagination) ([]business.BusinessMemberWithRoleNameAndAccount, int, error)

	GetAllMemberRoles(ctx context.Context) ([]business.BusinessMemberRole, error)
}
type RepositoryProvider interface {
	Account() AccountRepository
	Round() RoundRepository
	Investment() InvestmentRepository
	Business() BusinessRepository
	Industry() IndustryRepository
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
	Shutdown(ctx context.Context) error
}
