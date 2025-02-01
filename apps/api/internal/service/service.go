package service

import (
	"context"

	"fundlevel/internal/entities/account"
	"fundlevel/internal/entities/business"
	"fundlevel/internal/entities/industry"
	"fundlevel/internal/entities/investment"
	"fundlevel/internal/entities/round"
	accountService "fundlevel/internal/service/domain/account"
	businessService "fundlevel/internal/service/domain/business"
	healthService "fundlevel/internal/service/domain/health"
	industryService "fundlevel/internal/service/domain/industry"
	investmentService "fundlevel/internal/service/domain/investment"
	"fundlevel/internal/service/domain/permission"
	roundService "fundlevel/internal/service/domain/round"
	"fundlevel/internal/service/types"
	"fundlevel/internal/storage"

	"github.com/google/uuid"
	"go.uber.org/zap"
)

type AccountService interface {
	Create(ctx context.Context, params account.CreateAccountParams, userId uuid.UUID) (account.Account, error)
	Delete(ctx context.Context, id int) error
	Update(ctx context.Context, id int, params account.UpdateAccountParams) (account.Account, error)
	GetById(ctx context.Context, id int) (account.Account, error)
	GetByUserId(ctx context.Context, userId uuid.UUID) (account.Account, error)

	GetAllBusinesses(ctx context.Context, accountId int) ([]business.Business, error)

	GetStripeIdentityVerificationSessionURL(ctx context.Context, accountID int, returnURL string) (types.StripeSessionOutput, error)
	CreateStripeIdentity(ctx context.Context, accountID int, params account.CreateStripeIdentityParams) (account.StripeIdentity, error)
	DeleteStripeIdentity(ctx context.Context, accountID int) error
	GetStripeIdentity(ctx context.Context, accountID int) (account.StripeIdentity, error)
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
	GetByCursor(ctx context.Context, limit int, cursor int) ([]round.Round, error)
	GetByPage(ctx context.Context, pageSize int, page int) ([]round.Round, int, error)
	GetAvailableShares(ctx context.Context, id int) (int, error)
	GetTerms(ctx context.Context, id int) (round.RoundTerm, error)

	CompleteRound(ctx context.Context, id int) error
}

type BusinessService interface {
	Create(ctx context.Context, params business.CreateBusinessParams, initialOwnerId int) (business.Business, error)
	Delete(ctx context.Context, id int) error
	GetById(ctx context.Context, id int) (business.Business, error)
	Update(ctx context.Context, id int, params business.UpdateBusinessParams) (business.Business, error)

	GetStripeDashboardURL(ctx context.Context, businessId int) (types.URLField, error)
	CreateStripeAccountLink(ctx context.Context, accountID string, returnURL string, refreshURL string) (types.URLField, error)
	GetStripeAccount(ctx context.Context, businessId int) (business.BusinessStripeAccount, error)
	GetStripeAccountByAccountId(ctx context.Context, accountId string) (business.BusinessStripeAccount, error)
	UpdateStripeAccount(ctx context.Context, businessId int, params business.UpdateBusinessStripeAccountParams) (business.BusinessStripeAccount, error)
	GetStripeConnectedAccountDashboardURL(ctx context.Context, accountID string) (types.URLField, error)

	UpsertBusinessLegalSection(ctx context.Context, businessId int, params business.UpsertBusinessLegalSectionParams) error

	GetRoundsByPage(ctx context.Context, businessId int, pageSize int, page int) ([]round.Round, int, error)
	GetRoundsByCursor(ctx context.Context, businessId int, limit int, cursor int) ([]round.Round, error)

	GetMembersByPage(ctx context.Context, businessId int, pageSize int, page int) ([]business.BusinessMemberWithRoleNameAndAccount, int, error)
	GetAllMemberRoles(ctx context.Context) ([]business.BusinessMemberRole, error)

	GetRoundCreateRequirements(ctx context.Context, businessId int) (business.RoundCreateRequirements, error)
}

type InvestmentService interface {
	Create(ctx context.Context, investorId int, pricePerShareUsdCents int64, params investment.CreateInvestmentParams) (investment.Investment, error)
	GetById(ctx context.Context, id int) (investment.Investment, error)

	ConfirmPaymentIntent(ctx context.Context, investmentId int, confirmationToken string, returnURL string) (types.StripePaymentIntentOutput, error)
	HandleStripePaymentIntentSucceeded(ctx context.Context, intentID string) error
	HandleStripePaymentIntentStatusUpdated(ctx context.Context, intentID string) error
	HandleStripePaymentIntentFailed(ctx context.Context, intentID string) error

	GetPayments(ctx context.Context, investmentId int) ([]investment.Payment, error)
	GetCurrentPayment(ctx context.Context, investmentId int) (investment.Payment, error)
}

type PermissionService interface {
	CanAccessBusinessInvestments(ctx context.Context, accountId int, businessId int) (bool, error)
	CanAccountDeleteBusiness(ctx context.Context, accountId int, businessId int) (bool, error)
	CanManageBusinessStripe(ctx context.Context, accountId int, businessId int) (bool, error)
	CanAccessBusinessStripeDashboard(ctx context.Context, accountId int, businessId int) (bool, error)
	CanViewBusinessAnalytics(ctx context.Context, accountId int, businessId int) (bool, error)
	CanViewBusinessMembers(ctx context.Context, accountId int, businessId int) (bool, error)
	CanViewRoundAnalytics(ctx context.Context, accountId int, roundId int) (bool, error)
	CanViewInvestments(ctx context.Context, accountId int, roundId int) (bool, error)
	CanDeleteRound(ctx context.Context, accountId int, roundId int) (bool, error)
	CanBusinessCreateRound(ctx context.Context, business *business.Business) (bool, error)
	CanAccountCreateRound(ctx context.Context, accountId int, businessId int) (bool, error)
	CanManageBusinessLegalSection(ctx context.Context, accountId int, businessId int) (bool, error)

	CanCreateBusiness(ctx context.Context, account account.Account) (bool, error)

	CanInvestInRound(ctx context.Context, identity account.StripeIdentity) (bool, error)
}

type Service struct {
	repositories      storage.Repository
	RoundService      RoundService
	AccountService    AccountService
	HealthService     HealthService
	IndustryService   IndustryService
	BusinessService   BusinessService
	InvestmentService InvestmentService
	PermissionService PermissionService
}

type ServiceConfig struct {
	logger *zap.Logger
}

type ServiceConfigOption func(*ServiceConfig)

func WithLogger(logger *zap.Logger) ServiceConfigOption {
	return func(config *ServiceConfig) {
		config.logger = logger
	}
}

// NewService implementation for storage of all services.
func NewService(
	repositories storage.Repository,
	stripeAPIKey string,
	feePercentage float64,
	options ...ServiceConfigOption,
) *Service {
	config := &ServiceConfig{}
	for _, option := range options {
		option(config)
	}

	if config.logger == nil {
		config.logger = zap.NewNop()
	}

	serviceLogger := config.logger.Named("service")

	roundService := roundService.NewRoundService(repositories, serviceLogger)

	return &Service{
		repositories:      repositories,
		IndustryService:   industryService.NewIndustryService(repositories, serviceLogger),
		HealthService:     healthService.NewHealthService(repositories, serviceLogger),
		AccountService:    accountService.NewAccountService(repositories, stripeAPIKey, serviceLogger),
		RoundService:      roundService,
		InvestmentService: investmentService.NewInvestmentService(repositories, stripeAPIKey, feePercentage, serviceLogger, roundService),
		BusinessService:   businessService.NewBusinessService(repositories, stripeAPIKey, serviceLogger),
		PermissionService: permission.NewPermissionService(repositories, serviceLogger),
	}
}

func (s *Service) Shutdown(ctx context.Context) error {
	return s.repositories.Shutdown(ctx)
}
