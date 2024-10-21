package service

import (
	"context"

	"fundlevel/internal/entities/account"
	"fundlevel/internal/entities/business"
	"fundlevel/internal/entities/industry"
	"fundlevel/internal/entities/investment"
	"fundlevel/internal/entities/round"
	"fundlevel/internal/entities/shared"
	"fundlevel/internal/entities/venture"
	accountService "fundlevel/internal/service/domain/account"
	"fundlevel/internal/service/domain/billing"
	businessService "fundlevel/internal/service/domain/business"
	healthService "fundlevel/internal/service/domain/health"
	industryService "fundlevel/internal/service/domain/industry"
	investmentService "fundlevel/internal/service/domain/investment"
	roundService "fundlevel/internal/service/domain/round"
	userService "fundlevel/internal/service/domain/user"
	ventureService "fundlevel/internal/service/domain/venture"
	"fundlevel/internal/storage"

	"github.com/google/uuid"
)

type VentureService interface {
	Create(ctx context.Context, params venture.CreateVentureParams) (venture.Venture, error)
	Delete(ctx context.Context, id int) error
	Update(ctx context.Context, id int, params venture.UpdateVentureParams) (venture.Venture, error)
	GetById(ctx context.Context, id int) (venture.Venture, error)
	GetByCursor(ctx context.Context, limit int, cursor int, filter venture.VentureFilter) ([]venture.Venture, error)
	GetByPage(ctx context.Context, pageSize int, page int, filter venture.VentureFilter) ([]venture.Venture, int, error)

	GetRoundsByCursor(ctx context.Context, ventureId int, limit int, cursor int, filter round.RoundFilter) ([]round.Round, error)
	GetRoundsByPage(ctx context.Context, ventureId int, pageSize int, page int, filter round.RoundFilter) ([]round.Round, int, error)
	GetActiveRound(ctx context.Context, ventureId int) (round.Round, error)

	CreateLike(ctx context.Context, params venture.CreateVentureLikeParams) (venture.VentureLike, error)
	DeleteLike(ctx context.Context, ventureId int, accountId int) error
	IsLikedByAccount(ctx context.Context, ventureId int, accountId int) (bool, error)
	GetLikeCount(ctx context.Context, ventureId int) (int, error)

	GetInvestmentsByCursor(ctx context.Context, ventureId int, limit int, cursor int, filter investment.InvestmentFilter) ([]investment.RoundInvestment, error)
	GetInvestmentsByPage(ctx context.Context, ventureId int, pageSize int, page int, filter investment.InvestmentFilter) ([]investment.RoundInvestment, int, error)
}

type UserService interface {
	GetAccount(ctx context.Context, id uuid.UUID) (account.Account, error)
}

type AccountService interface {
	Create(ctx context.Context, params account.CreateAccountParams) (account.Account, error)
	Delete(ctx context.Context, id int) error
	Update(ctx context.Context, id int, params account.UpdateAccountParams) (account.Account, error)
	GetById(ctx context.Context, id int) (account.Account, error)

	GetInvestmentsByCursor(ctx context.Context, accountId int, limit int, cursor int, filter investment.InvestmentFilter) ([]investment.RoundInvestment, error)
	GetInvestmentsByPage(ctx context.Context, accountId int, pageSize int, page int, filter investment.InvestmentFilter) ([]investment.RoundInvestment, int, error)
	GetInvestmentById(ctx context.Context, accountId int, investmentId int) (investment.RoundInvestment, error)

	GetAllBusinesses(ctx context.Context, accountId int) ([]business.Business, error)
}

type IndustryService interface {
	GetAll(ctx context.Context) ([]industry.Industry, error)
}

type HealthService interface {
	HealthCheck(ctx context.Context) error
}

type RoundService interface {
	Create(ctx context.Context, params round.CreateRoundParams) (round.Round, error)
	Delete(ctx context.Context, id int) error
	GetById(ctx context.Context, id int) (round.Round, error)
	GetByCursor(ctx context.Context, limit int, cursor int, filter round.RoundFilter) ([]round.Round, error)
	GetByPage(ctx context.Context, pageSize int, page int, filter round.RoundFilter) ([]round.Round, int, error)

	CreateLike(ctx context.Context, params round.CreateRoundLikeParams) (round.RoundLike, error)
	DeleteLike(ctx context.Context, roundId int, accountId int) error
	IsLikedByAccount(ctx context.Context, roundId int, accountId int) (bool, error)
	GetLikeCount(ctx context.Context, roundId int) (int, error)

	GetInvestmentsByCursor(ctx context.Context, roundId int, limit int, cursor int, filter investment.InvestmentFilter) ([]investment.RoundInvestment, error)
	GetInvestmentsByPage(ctx context.Context, roundId int, pageSize int, page int, filter investment.InvestmentFilter) ([]investment.RoundInvestment, int, error)
}

type BusinessService interface {
	Create(ctx context.Context, params business.CreateBusinessParams) (business.Business, error)
	Delete(ctx context.Context, id int) error
	GetById(ctx context.Context, id int) (business.Business, error)

	GetVenturesByCursor(ctx context.Context, accountId int, limit int, cursor int, filter venture.VentureFilter) ([]venture.Venture, error)
	GetVenturesByPage(ctx context.Context, accountId int, pageSize int, page int, filter venture.VentureFilter) ([]venture.Venture, int, error)

	GetRoundsByPage(ctx context.Context, businessId int, pageSize int, page int, filter round.RoundFilter) ([]round.Round, int, error)
	GetRoundsByCursor(ctx context.Context, businessId int, limit int, cursor int, filter round.RoundFilter) ([]round.Round, error)

	// GetInvestmentsByCursor gets all of the investments received on the rounds related to the business using cursor pagination
	GetInvestmentsByCursor(ctx context.Context, businessId int, limit int, cursor int, filter investment.InvestmentFilter) ([]investment.RoundInvestment, error)
	GetInvestmentsByPage(ctx context.Context, businessId int, pageSize int, page int, filter investment.InvestmentFilter) ([]investment.RoundInvestment, int, error)

	// GetTotalFunding gets the amount the business has successfully raised through rounds
	GetTotalFunding(ctx context.Context, businessId int) (int, error)
}

type BillingService interface {
	CreateInvestmentCheckoutSession(ctx context.Context, price int, successURL string, cancelURL string, investmentId int, currency shared.Currency) (string, error)
	HandleInvestmentCheckoutSuccess(ctx context.Context, sessionID string) (string, error)
}

type InvestmentService interface {
	AcceptInvestment(ctx context.Context, investmentId int) error
	WithdrawInvestment(ctx context.Context, investmentId int) error
	DeleteInvestment(ctx context.Context, investmentId int) error
	CreateInvestment(ctx context.Context, params investment.CreateInvestmentParams) (investment.RoundInvestment, error)
	GetById(ctx context.Context, id int) (investment.RoundInvestment, error)
	Update(ctx context.Context, id int, params investment.UpdateInvestmentParams) (investment.RoundInvestment, error)
}

type Service struct {
	VentureService    VentureService
	RoundService      RoundService
	AccountService    AccountService
	HealthService     HealthService
	IndustryService   IndustryService
	UserService       UserService
	BusinessService   BusinessService
	BillingService    BillingService
	InvestmentService InvestmentService
}

// NewService implementation for storage of all services.
func NewService(
	repositories storage.Repository,
	config billing.BillingServiceConfig,
) *Service {
	return &Service{
		VentureService:    ventureService.NewVentureService(repositories),
		IndustryService:   industryService.NewIndustryService(repositories),
		HealthService:     healthService.NewHealthService(repositories),
		AccountService:    accountService.NewAccountService(repositories),
		UserService:       userService.NewUserService(repositories),
		RoundService:      roundService.NewRoundService(repositories),
		BusinessService:   businessService.NewBusinessService(repositories),
		BillingService:    billing.NewBillingService(repositories, config),
		InvestmentService: investmentService.NewInvestmentService(repositories),
	}
}
