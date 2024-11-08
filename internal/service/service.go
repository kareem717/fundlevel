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
	"fundlevel/internal/entities/shared"
	"fundlevel/internal/entities/venture"
	accountService "fundlevel/internal/service/domain/account"
	analyticService "fundlevel/internal/service/domain/analytic"
	"fundlevel/internal/service/domain/billing"
	businessService "fundlevel/internal/service/domain/business"
	chatService "fundlevel/internal/service/domain/chat"
	healthService "fundlevel/internal/service/domain/health"
	industryService "fundlevel/internal/service/domain/industry"
	investmentService "fundlevel/internal/service/domain/investment"
	roundService "fundlevel/internal/service/domain/round"
	userService "fundlevel/internal/service/domain/user"
	ventureService "fundlevel/internal/service/domain/venture"
	"fundlevel/internal/storage"

	"github.com/google/uuid"
	"github.com/stripe/stripe-go/v80"
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
	GetById(ctx context.Context, id int) (round.Round, error)
	GetByCursor(ctx context.Context, limit int, cursor int, filter round.RoundFilter) ([]round.Round, error)
	GetByPage(ctx context.Context, pageSize int, page int, filter round.RoundFilter) ([]round.Round, int, error)

	GetInvestmentsByCursor(ctx context.Context, roundId int, limit int, cursor int, filter investment.InvestmentFilter) ([]investment.RoundInvestment, error)
	GetInvestmentsByPage(ctx context.Context, roundId int, pageSize int, page int, filter investment.InvestmentFilter) ([]investment.RoundInvestment, int, error)
}

type BusinessService interface {
	Create(ctx context.Context, params business.CreateBusinessParams) (business.Business, error)
	Delete(ctx context.Context, id int) error
	GetById(ctx context.Context, id int) (business.Business, error)
	Update(ctx context.Context, id int, params business.UpdateBusinessParams) (business.Business, error)
	GetByStripeConnectedAccountId(ctx context.Context, stripeConnectedAccountId string) (business.Business, error)

	GetStripeDashboardURL(ctx context.Context, businessId int) (string, error)

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
	CreateInvestmentPaymentIntent(ctx context.Context, price int, investmentId int, currency shared.Currency, businessStripeAccountID string) (*stripe.PaymentIntent, error)
	HandleInvestmentPaymentIntentSuccess(ctx context.Context, intentID string) error
	HandleInvestmentPaymentIntentPaymentFailed(ctx context.Context, intentID string) error
	HandleInvestmentPaymentIntentProcessing(ctx context.Context, intentID string) error
	HandleInvestmentPaymentIntentCancelled(ctx context.Context, intentID string) error

	CreateAccountLink(ctx context.Context, accountID string, returnURL string, refreshURL string) (string, error)
	CreateStripeConnectedAccount(ctx context.Context) (stripe.Account, error)
	DeleteStripeConnectedAccount(ctx context.Context, accountID string) error
	GetStripeConnectedAccountDashboardURL(ctx context.Context, accountID string) (string, error)
}

type InvestmentService interface {
	ProcessInvestment(ctx context.Context, investmentId int) error
	WithdrawInvestment(ctx context.Context, investmentId int) error
	DeleteInvestment(ctx context.Context, investmentId int) error
	CreateInvestment(ctx context.Context, params investment.CreateInvestmentParams) (investment.RoundInvestment, error)
	GetById(ctx context.Context, id int) (investment.RoundInvestment, error)
	Update(ctx context.Context, id int, params investment.UpdateInvestmentParams) (investment.RoundInvestment, error)
}

type AnalyticService interface {
	CreateRoundImpression(ctx context.Context, params analytic.CreateRoundImpressionParams) error
	GetRoundImpressionCount(ctx context.Context, roundId int) (int, error)

	CreateRoundFavourite(ctx context.Context, params analytic.CreateRoundFavouriteParams) error
	DeleteRoundFavourite(ctx context.Context, roundId int, accountId int) error
	IsRoundFavouritedByAccount(ctx context.Context, roundId int, accountId int) (bool, error)
	GetRoundFavouriteCount(ctx context.Context, roundId int) (int, error)

	CreateVentureImpression(ctx context.Context, params analytic.CreateVentureImpressionParams) error
	GetVentureImpressionCount(ctx context.Context, ventureId int) (int, error)

	CreateVentureFavourite(ctx context.Context, params analytic.CreateVentureFavouriteParams) error
	DeleteVentureFavourite(ctx context.Context, ventureId int, accountId int) error
	IsVentureFavouritedByAccount(ctx context.Context, ventureId int, accountId int) (bool, error)
	GetVentureFavouriteCount(ctx context.Context, ventureId int) (int, error)

	CreateBusinessImpression(ctx context.Context, params analytic.CreateBusinessImpressionParams) error
	GetBusinessImpressionCount(ctx context.Context, businessId int) (int, error)

	CreateBusinessFavourite(ctx context.Context, params analytic.CreateBusinessFavouriteParams) error
	DeleteBusinessFavourite(ctx context.Context, businessId int, accountId int) error
	IsBusinessFavouritedByAccount(ctx context.Context, businessId int, accountId int) (bool, error)
	GetBusinessFavouriteCount(ctx context.Context, businessId int) (int, error)

	GetDailyAggregatedBusinessAnalytics(ctx context.Context, businessId int, minDayOfYear int, maxDayOfYear int) ([]analytic.SimplifiedDailyAggregatedBusinessAnalytics, error)
	GetDailyAggregatedVentureAnalytics(ctx context.Context, ventureId int, minDayOfYear int, maxDayOfYear int) ([]analytic.SimplifiedDailyAggregatedVentureAnalytics, error)
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

type Service struct {
	VentureService    VentureService
	RoundService      RoundService
	AccountService    AccountService
	HealthService     HealthService
	IndustryService   IndustryService
	AnalyticService   AnalyticService
	UserService       UserService
	BusinessService   BusinessService
	BillingService    BillingService
	InvestmentService InvestmentService
	ChatService       ChatService
}

// NewService implementation for storage of all services.
func NewService(
	repositories storage.Repository,
	config billing.BillingServiceConfig,
) *Service {
	billingService := billing.NewBillingService(repositories, config)

	return &Service{
		VentureService:    ventureService.NewVentureService(repositories),
		IndustryService:   industryService.NewIndustryService(repositories),
		HealthService:     healthService.NewHealthService(repositories),
		AnalyticService:   analyticService.NewAnalyticService(repositories),
		AccountService:    accountService.NewAccountService(repositories),
		UserService:       userService.NewUserService(repositories),
		RoundService:      roundService.NewRoundService(repositories),
		BusinessService:   businessService.NewBusinessService(repositories, billingService),
		BillingService:    billingService,
		InvestmentService: investmentService.NewInvestmentService(repositories, billingService),
		ChatService:       chatService.NewChatService(repositories),
	}
}
