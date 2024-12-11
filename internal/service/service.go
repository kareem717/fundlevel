package service

import (
	"context"
	"time"

	"fundlevel/internal/entities/account"
	"fundlevel/internal/entities/analytic"
	"fundlevel/internal/entities/business"
	"fundlevel/internal/entities/chat"
	"fundlevel/internal/entities/industry"
	"fundlevel/internal/entities/investment"
	"fundlevel/internal/entities/round"
	accountService "fundlevel/internal/service/domain/account"
	analyticService "fundlevel/internal/service/domain/analytic"
	businessService "fundlevel/internal/service/domain/business"
	chatService "fundlevel/internal/service/domain/chat"
	healthService "fundlevel/internal/service/domain/health"
	industryService "fundlevel/internal/service/domain/industry"
	investmentService "fundlevel/internal/service/domain/investment"
	"fundlevel/internal/service/domain/permission"
	roundService "fundlevel/internal/service/domain/round"
	userService "fundlevel/internal/service/domain/user"
	"fundlevel/internal/storage"

	"github.com/google/uuid"
	"github.com/stripe/stripe-go/v80"
)

type UserService interface {
	GetAccount(ctx context.Context, id uuid.UUID) (account.Account, error)
}

type AccountService interface {
	Create(ctx context.Context, params account.CreateAccountParams) (account.Account, error)
	Delete(ctx context.Context, id int) error
	Update(ctx context.Context, id int, params account.UpdateAccountParams) (account.Account, error)
	GetById(ctx context.Context, id int) (account.Account, error)

	GetInvestmentsByCursor(ctx context.Context, accountId int, limit int, cursor int, filter investment.InvestmentFilter) ([]investment.Investment, error)
	GetInvestmentsByPage(ctx context.Context, accountId int, pageSize int, page int, filter investment.InvestmentFilter) ([]investment.Investment, int, error)
	GetInvestmentById(ctx context.Context, accountId int, investmentId int) (investment.Investment, error)
	IsInvestedInRound(ctx context.Context, accountId int, roundId int) (bool, error)

	GetAllBusinesses(ctx context.Context, accountId int) ([]business.Business, error)

	GetChatsByCursor(ctx context.Context, accountId int, limit int, cursor time.Time) ([]chat.Chat, error)
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
	GetById(ctx context.Context, id int) (round.RoundWithBusiness, error)
	GetByCursor(ctx context.Context, limit int, cursor int) ([]round.Round, error)
	GetByPage(ctx context.Context, pageSize int, page int) ([]round.Round, int, error)

	GetInvestmentsByCursor(ctx context.Context, roundId int, limit int, cursor int, filter investment.InvestmentFilter) ([]investment.Investment, error)
	GetInvestmentsByPage(ctx context.Context, roundId int, pageSize int, page int, filter investment.InvestmentFilter) ([]investment.Investment, int, error)
}

type BusinessService interface {
	Create(ctx context.Context, params business.CreateBusinessParams) error
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

	// GetInvestmentsByCursor gets all of the investments received on the rounds related to the business using cursor pagination
	GetInvestmentsByCursor(ctx context.Context, businessId int, limit int, cursor int, filter investment.InvestmentFilter) ([]investment.Investment, error)
	GetInvestmentsByPage(ctx context.Context, businessId int, pageSize int, page int, filter investment.InvestmentFilter) ([]investment.Investment, int, error)

	// GetTotalFunding gets the amount the business has successfully raised through rounds
	GetTotalFunding(ctx context.Context, businessId int) (int, error)

	GetMembersByPage(ctx context.Context, businessId int, pageSize int, page int) ([]business.BusinessMemberWithRoleNameAndAccount, int, error)
	GetAllMemberRoles(ctx context.Context) ([]business.BusinessMemberRole, error)

	GetRoundCreateRequirements(ctx context.Context, businessId int) (business.RoundCreateRequirements, error)
}

type InvestmentService interface {
	// WithdrawInvestment(ctx context.Context, investmentId int) error
	// DeleteInvestment(ctx context.Context, investmentId int) error

	// Create creates an investment record and returns the investment record.
	// If round is not provided, it will fetch it from the database.
	Create(ctx context.Context, investorId int, round *round.Round) (investment.Investment, error)
	GetById(ctx context.Context, id int) (investment.Investment, error)
	// Update(ctx context.Context, id int, params investment.UpdateInvestmentParams) (investment.Investment, error)

	// CreateStripePaymentIntent simply creates a Stripe payment intent for the given investment.
	CreateStripePaymentIntent(ctx context.Context, investmentId int) (*stripe.PaymentIntent, error)
	
	// HandleStripePaymentIntentCreated is a callback function that is called when a Stripe payment intent is created.
	// It tries to create a `investment_payment` record in the database, cancelling the Stripe payment intent if it fails.
	HandleStripePaymentIntentCreated(ctx context.Context, intentID string) error

	// HandleStripePaymentIntentSuccess is a callback function that is called when a Stripe payment intent is successful.
	HandleStripePaymentIntentSuccess(ctx context.Context, intentID string) error

	GetPayments(ctx context.Context, investmentId int) ([]investment.InvestmentPayment, error)
	GetCurrentPayment(ctx context.Context, investmentId int) (investment.InvestmentPayment, error)
	// HandleInvestmentPaymentIntentSuccess(ctx context.Context, intentID string) error
	// HandleInvestmentPaymentIntentPaymentFailed(ctx context.Context, intentID string) error
	// HandleInvestmentPaymentIntentProcessing(ctx context.Context, intentID string) error
	// HandleInvestmentPaymentIntentCancelled(ctx context.Context, intentID string) error
	// CapturePaymentIntent(ctx context.Context, intentID string) error
}

type AnalyticService interface {
	CreateRoundImpression(ctx context.Context, params analytic.CreateRoundImpressionParams) error
	GetRoundImpressionCount(ctx context.Context, roundId int) (int, error)

	CreateRoundFavourite(ctx context.Context, params analytic.CreateRoundFavouriteParams) error
	DeleteRoundFavourite(ctx context.Context, roundId int, accountId int) error
	IsRoundFavouritedByAccount(ctx context.Context, roundId int, accountId int) (bool, error)
	GetRoundFavouriteCount(ctx context.Context, roundId int) (int, error)

	CreateBusinessImpression(ctx context.Context, params analytic.CreateBusinessImpressionParams) error
	GetBusinessImpressionCount(ctx context.Context, businessId int) (int, error)

	CreateBusinessFavourite(ctx context.Context, params analytic.CreateBusinessFavouriteParams) error
	DeleteBusinessFavourite(ctx context.Context, businessId int, accountId int) error
	IsBusinessFavouritedByAccount(ctx context.Context, businessId int, accountId int) (bool, error)
	GetBusinessFavouriteCount(ctx context.Context, businessId int) (int, error)

	GetDailyAggregatedBusinessAnalytics(ctx context.Context, businessId int, minDayOfYear int, maxDayOfYear int) ([]analytic.SimplifiedDailyAggregatedBusinessAnalytics, error)
	GetDailyAggregatedRoundAnalytics(ctx context.Context, roundId int, minDayOfYear int, maxDayOfYear int) ([]analytic.SimplifiedDailyAggregatedRoundAnalytics, error)
}

type ChatService interface {
	CreateMessage(ctx context.Context, params chat.CreateMessageParams) (chat.ChatMessage, error)
	UpdateMessage(ctx context.Context, id int, params chat.UpdateMessageParams) (chat.ChatMessage, error)
	DeleteMessage(ctx context.Context, id int) error
	GetMessageById(ctx context.Context, id int) (chat.ChatMessage, error)
	GetMessages(ctx context.Context, chatID int, filter chat.MessageFilter, limit int, cursor time.Time) ([]chat.ChatMessage, error)

	Create(ctx context.Context, params chat.CreateChatParams) (chat.Chat, error)
	Update(ctx context.Context, chatID int, params chat.UpdateChatParams) (chat.Chat, error)
	Delete(ctx context.Context, chatID int) error
	GetChatById(ctx context.Context, id int) (chat.Chat, error)

	IsAccountInChat(ctx context.Context, chatID int, accountID int) (bool, error)
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
}

type Service struct {
	RoundService      RoundService
	AccountService    AccountService
	HealthService     HealthService
	IndustryService   IndustryService
	AnalyticService   AnalyticService
	UserService       UserService
	BusinessService   BusinessService
	InvestmentService InvestmentService
	ChatService       ChatService
	PermissionService PermissionService
}

// NewService implementation for storage of all services.
func NewService(
	repositories storage.Repository,
	stripeAPIKey string,
	feePercentage float64,
) *Service {
	return &Service{
		IndustryService:   industryService.NewIndustryService(repositories),
		HealthService:     healthService.NewHealthService(repositories),
		AnalyticService:   analyticService.NewAnalyticService(repositories),
		AccountService:    accountService.NewAccountService(repositories),
		UserService:       userService.NewUserService(repositories),
		RoundService:      roundService.NewRoundService(repositories),
		InvestmentService: investmentService.NewInvestmentService(repositories, stripeAPIKey, feePercentage),
		BusinessService:   businessService.NewBusinessService(repositories, stripeAPIKey),
		ChatService:       chatService.NewChatService(repositories),
		PermissionService: permission.NewPermissionService(repositories),
	}
}
