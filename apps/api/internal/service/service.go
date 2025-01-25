package service

import (
	"context"

	"fundlevel/internal/entities/account"
	"fundlevel/internal/entities/analytic"
	"fundlevel/internal/entities/business"
	"fundlevel/internal/entities/industry"
	"fundlevel/internal/entities/investment"
	"fundlevel/internal/entities/round"
	accountService "fundlevel/internal/service/domain/account"
	analyticService "fundlevel/internal/service/domain/analytic"
	businessService "fundlevel/internal/service/domain/business"
	healthService "fundlevel/internal/service/domain/health"
	industryService "fundlevel/internal/service/domain/industry"
	investmentService "fundlevel/internal/service/domain/investment"
	"fundlevel/internal/service/domain/permission"
	roundService "fundlevel/internal/service/domain/round"
	"fundlevel/internal/storage"

	"github.com/google/uuid"

	"github.com/stripe/stripe-go/v81"
)

type AccountService interface {
	Create(ctx context.Context, params account.CreateAccountParams, userId uuid.UUID) (account.Account, error)
	Delete(ctx context.Context, id int) error
	Update(ctx context.Context, id int, params account.UpdateAccountParams) (account.Account, error)
	GetById(ctx context.Context, id int) (account.Account, error)
	GetByUserId(ctx context.Context, userId uuid.UUID) (account.Account, error)

	GetAllBusinesses(ctx context.Context, accountId int) ([]business.Business, error)

	GetStripeIdentityVerificationSessionURL(ctx context.Context, accountID int, returnURL string) (string, error)
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
}

type BusinessService interface {
	Create(ctx context.Context, params business.CreateBusinessParams, initialOwnerId int) (business.Business, error)
	Delete(ctx context.Context, id int) error
	GetById(ctx context.Context, id int) (business.Business, error)
	Update(ctx context.Context, id int, params business.UpdateBusinessParams) (business.Business, error)

	GetStripeDashboardURL(ctx context.Context, businessId int) (string, error)
	CreateStripeAccountLink(ctx context.Context, accountID string, returnURL string, refreshURL string) (string, error)
	GetStripeAccount(ctx context.Context, businessId int) (business.BusinessStripeAccount, error)
	GetStripeAccountByAccountId(ctx context.Context, accountId string) (business.BusinessStripeAccount, error)
	UpdateStripeAccount(ctx context.Context, businessId int, params business.UpdateBusinessStripeAccountParams) (business.BusinessStripeAccount, error)
	GetStripeConnectedAccountDashboardURL(ctx context.Context, accountID string) (string, error)

	UpsertBusinessLegalSection(ctx context.Context, businessId int, params business.UpsertBusinessLegalSectionParams) error

	GetRoundsByPage(ctx context.Context, businessId int, pageSize int, page int) ([]round.Round, int, error)
	GetRoundsByCursor(ctx context.Context, businessId int, limit int, cursor int) ([]round.Round, error)

	GetMembersByPage(ctx context.Context, businessId int, pageSize int, page int) ([]business.BusinessMemberWithRoleNameAndAccount, int, error)
	GetAllMemberRoles(ctx context.Context) ([]business.BusinessMemberRole, error)

	GetRoundCreateRequirements(ctx context.Context, businessId int) (business.RoundCreateRequirements, error)
}

type InvestmentService interface {
	// WithdrawInvestment(ctx context.Context, investmentId int) error
	// DeleteInvestment(ctx context.Context, investmentId int) error

	// Create creates an investment record and returns the investment record.
	// If round is not provided, it will fetch it from the database.
	Create(ctx context.Context, investorId int, params investment.CreateInvestmentParams) (investment.Investment, error)
	GetById(ctx context.Context, id int) (investment.Investment, error)
	// Update(ctx context.Context, id int, params investment.UpdateInvestmentParams) (investment.Investment, error)

	// CreateStripePaymentIntent simply creates a Stripe payment intent for the given investment.
	CreateStripePaymentIntent(ctx context.Context, investmentId int) (*stripe.PaymentIntent, error)

	// HandleStripePaymentIntentCreated is a callback function that is called when a Stripe payment intent is created.
	// It tries to create a `investment_payment` record in the database, cancelling the Stripe payment intent if it fails.
	HandleStripePaymentIntentCreated(ctx context.Context, intentID string) error

	// HandleStripePaymentIntentSuccess is a callback function that is called when a Stripe payment intent is successful.
	HandleStripePaymentIntentSucceeded(ctx context.Context, intentID string) error
	HandleStripePaymentIntentStatusUpdated(ctx context.Context, intentID string) error
	HandleStripePaymentIntentFailed(ctx context.Context, intentID string) error

	GetPayments(ctx context.Context, investmentId int) ([]investment.InvestmentPayment, error)
	GetCurrentPayment(ctx context.Context, investmentId int) (investment.InvestmentPayment, error)
	// HandleInvestmentPaymentIntentSuccess(ctx context.Context, intentID string) error
	// HandleInvestmentPaymentIntentPaymentFailed(ctx context.Context, intentID string) error
	// HandleInvestmentPaymentIntentProcessing(ctx context.Context, intentID string) error
	// HandleInvestmentPaymentIntentCancelled(ctx context.Context, intentID string) error
	// CapturePaymentIntent(ctx context.Context, intentID string) error
}

type AnalyticService interface {
	CreateRoundImpression(ctx context.Context, roundId int, accountId int) error
	GetRoundImpressionCount(ctx context.Context, roundId int) (int, error)

	CreateRoundFavourite(ctx context.Context, roundId int, accountId int) error
	DeleteRoundFavourite(ctx context.Context, roundId int, accountId int) error
	IsRoundFavouritedByAccount(ctx context.Context, roundId int, accountId int) (bool, error)
	GetRoundFavouriteCount(ctx context.Context, roundId int) (int, error)

	CreateBusinessImpression(ctx context.Context, businessId int, accountId int) error
	GetBusinessImpressionCount(ctx context.Context, businessId int) (int, error)

	CreateBusinessFavourite(ctx context.Context, businessId int, accountId int) error
	DeleteBusinessFavourite(ctx context.Context, businessId int, accountId int) error
	IsBusinessFavouritedByAccount(ctx context.Context, businessId int, accountId int) (bool, error)
	GetBusinessFavouriteCount(ctx context.Context, businessId int) (int, error)

	GetDailyAggregatedBusinessAnalytics(ctx context.Context, businessId int, minDayOfYear int, maxDayOfYear int) ([]analytic.SimplifiedDailyAggregatedBusinessAnalytics, error)
	GetDailyAggregatedRoundAnalytics(ctx context.Context, roundId int, minDayOfYear int, maxDayOfYear int) ([]analytic.SimplifiedDailyAggregatedRoundAnalytics, error)
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
	AnalyticService   AnalyticService
	BusinessService   BusinessService
	InvestmentService InvestmentService
	PermissionService PermissionService
}

// NewService implementation for storage of all services.
func NewService(
	repositories storage.Repository,
	stripeAPIKey string,
	feePercentage float64,
) *Service {
	return &Service{
		repositories:      repositories,
		IndustryService:   industryService.NewIndustryService(repositories),
		HealthService:     healthService.NewHealthService(repositories),
		AnalyticService:   analyticService.NewAnalyticService(repositories),
		AccountService:    accountService.NewAccountService(repositories, stripeAPIKey),
		RoundService:      roundService.NewRoundService(repositories),
		InvestmentService: investmentService.NewInvestmentService(repositories, stripeAPIKey, feePercentage),
		BusinessService:   businessService.NewBusinessService(repositories, stripeAPIKey),
		PermissionService: permission.NewPermissionService(repositories),
	}
}

func (s *Service) Shutdown(ctx context.Context) error {
	return s.repositories.Shutdown(ctx)
}
