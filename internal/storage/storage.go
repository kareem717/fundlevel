package storage

import (
	"context"

	"fundlevel/internal/entities/account"
	"fundlevel/internal/entities/analytic"
	"fundlevel/internal/entities/business"
	"fundlevel/internal/entities/chat"
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
	GetById(ctx context.Context, id int) (round.RoundWithBusiness, error)
	GetByCursor(ctx context.Context, paginationParams shared.CursorPagination, filter round.RoundFilter) ([]round.Round, error)
	GetByPage(ctx context.Context, paginationParams shared.OffsetPagination, filter round.RoundFilter) ([]round.Round, int, error)
	Update(ctx context.Context, id int, params round.UpdateRoundParams) (round.Round, error)

	// GetInvestmentsByCursor gets all of the investments received on the round using cursor pagination
	GetInvestmentsByCursor(ctx context.Context, roundId int, paginationParams shared.CursorPagination, filter investment.InvestmentFilter) ([]investment.RoundInvestment, error)
	// GetInvestmentsByPage gets all of the investments received on the round using offset pagination
	GetInvestmentsByPage(ctx context.Context, roundId int, paginationParams shared.OffsetPagination, filter investment.InvestmentFilter) ([]investment.RoundInvestment, int, error)
}

type InvestmentRepository interface {
	Create(ctx context.Context, params investment.CreateInvestmentParams) (investment.RoundInvestment, error)
	Delete(ctx context.Context, id int) error
	Update(ctx context.Context, id int, params investment.UpdateInvestmentParams) (investment.RoundInvestment, error)
	GetById(ctx context.Context, id int) (investment.RoundInvestment, error)
	GetByCursor(ctx context.Context, paginationParams shared.CursorPagination, filter investment.InvestmentFilter) ([]investment.RoundInvestment, error)
	GetByPage(ctx context.Context, paginationParams shared.OffsetPagination, filter investment.InvestmentFilter) ([]investment.RoundInvestment, int, error)
	GetByRoundIdAndAccountId(ctx context.Context, roundId int, accountId int) (investment.RoundInvestment, error)
	UpdateProcessingAndPendingInvestmentsByRoundId(ctx context.Context, roundId int, status investment.InvestmentStatus) error

	CreatePayment(ctx context.Context, params investment.CreateRoundInvestmentPaymentParams) (investment.RoundInvestmentPayment, error)
	UpdatePayment(ctx context.Context, investmentId int, params investment.UpdateRoundInvestmentPaymentParams) (investment.RoundInvestmentPayment, error)
	GetPayment(ctx context.Context, roundInvestmentId int) (investment.RoundInvestmentPayment, error)
	GetPaymentByIntentId(ctx context.Context, intentId string) (investment.RoundInvestmentPayment, error)
}

type AccountRepository interface {
	Create(ctx context.Context, params account.CreateAccountParams) (account.Account, error)
	Delete(ctx context.Context, id int) error
	Update(ctx context.Context, id int, params account.UpdateAccountParams) (account.Account, error)
	GetById(ctx context.Context, id int) (account.Account, error)

	// GetInvestmentsByCursor gets all of the investments the account has made on rounds using cursor pagination
	GetInvestmentsByCursor(ctx context.Context, accountId int, paginationParams shared.CursorPagination, filter investment.InvestmentFilter) ([]investment.RoundInvestment, error)
	// GetInvestmentsByPage gets all of the investments the account has made on rounds using offset pagination
	GetInvestmentsByPage(ctx context.Context, accountId int, paginationParams shared.OffsetPagination, filter investment.InvestmentFilter) ([]investment.RoundInvestment, int, error)
	// GetRoundInvestment attempts to get an investment on a round made by the account that is not withdrawn
	IsInvestedInRound(ctx context.Context, accountId int, roundId int) (bool, error)
	GetInvestmentById(ctx context.Context, accountId int, investmentId int) (investment.RoundInvestment, error)

	GetChatsByCursor(ctx context.Context, accountId int, pagination shared.TimeCursorPagination) ([]chat.Chat, error)

	GetAllBusinesses(ctx context.Context, accountId int) ([]business.Business, error)
}

type UserRepository interface {
	GetAccount(ctx context.Context, userId uuid.UUID) (account.Account, error)
}

type BusinessRepository interface {
	Create(ctx context.Context, params business.CreateBusinessParams) error
	GetById(ctx context.Context, id int) (business.Business, error)
	Update(ctx context.Context, id int, params business.UpdateBusinessParams) (business.Business, error)
	Delete(ctx context.Context, id int) error
	// GetByStripeConnectedAccountId(ctx context.Context, stripeConnectedAccountId string) (business.Business, error)

	CreateBusinessLegalSection(ctx context.Context, businessId int, params business.CreateBusinessLegalSectionParams) error
	
	GetStripeAccountByAccountId(ctx context.Context, accountId string) (business.BusinessStripeAccount, error)
	UpdateStripeAccount(ctx context.Context, businessId int, params business.UpdateBusinessStripeAccountParams) (business.BusinessStripeAccount, error)
	GetStripeAccount(ctx context.Context, businessId int) (business.BusinessStripeAccount, error)
	DeleteStripeAccount(ctx context.Context, businessId int) error

	GetRoundsByPage(ctx context.Context, businessId int, paginationParams shared.OffsetPagination, filter round.RoundFilter) ([]round.Round, int, error)
	GetRoundsByCursor(ctx context.Context, businessId int, paginationParams shared.CursorPagination, filter round.RoundFilter) ([]round.Round, error)

	// GetInvestmentsByCursor gets all of the investments received on the rounds related to the business using cursor pagination
	GetInvestmentsByCursor(ctx context.Context, businessId int, paginationParams shared.CursorPagination, filter investment.InvestmentFilter) ([]investment.RoundInvestment, error)
	// GetInvestmentsByPage gets all of the investments received on the rounds related to the business using offset pagination
	GetInvestmentsByPage(ctx context.Context, businessId int, paginationParams shared.OffsetPagination, filter investment.InvestmentFilter) ([]investment.RoundInvestment, int, error)

	// GetTotalFunding gets the amount the business has successfully raised through rounds
	GetTotalFunding(ctx context.Context, businessId int) (int, error)

	GetBusinessMember(ctx context.Context, businessId int, accountId int) (business.BusinessMemberWithRole, error)
	GetMembersByPage(ctx context.Context, businessId int, paginationParams shared.OffsetPagination) ([]business.BusinessMemberWithRoleNameAndAccount, int, error)

	GetAllMemberRoles(ctx context.Context) ([]business.BusinessMemberRole, error)
}

type AnalyticRepository interface {
	GetDailyAggregatedBusinessAnalytics(ctx context.Context, businessId int, minDayOfYear int, maxDayOfYear int) ([]analytic.SimplifiedDailyAggregatedBusinessAnalytics, error)
	GetDailyAggregatedRoundAnalytics(ctx context.Context, roundId int, minDayOfYear int, maxDayOfYear int) ([]analytic.SimplifiedDailyAggregatedRoundAnalytics, error)

	CreateRoundImpression(ctx context.Context, params analytic.CreateRoundImpressionParams) error
	CreateBusinessImpression(ctx context.Context, params analytic.CreateBusinessImpressionParams) error

	GetRoundImpressionCount(ctx context.Context, roundId int) (int, error)
	GetBusinessImpressionCount(ctx context.Context, businessId int) (int, error)

	CreateBusinessFavourite(ctx context.Context, params analytic.CreateBusinessFavouriteParams) error
	DeleteBusinessFavourite(ctx context.Context, businessId int, accountId int) error
	IsBusinessFavouritedByAccount(ctx context.Context, businessId int, accountId int) (bool, error)
	GetBusinessFavouriteCount(ctx context.Context, businessId int) (int, error)

	CreateRoundFavourite(ctx context.Context, params analytic.CreateRoundFavouriteParams) error
	DeleteRoundFavourite(ctx context.Context, roundId int, accountId int) error
	IsRoundFavouritedByAccount(ctx context.Context, roundId int, accountId int) (bool, error)
	GetRoundFavouriteCount(ctx context.Context, roundId int) (int, error)
}

type ChatRepository interface {
	CreateMessage(ctx context.Context, params chat.CreateMessageParams) (chat.ChatMessage, error)
	UpdateMessage(ctx context.Context, id int, params chat.UpdateMessageParams) (chat.ChatMessage, error)
	DeleteMessage(ctx context.Context, id int) error
	GetMessageById(ctx context.Context, messageId int) (chat.ChatMessage, error)

	GetChatMessages(ctx context.Context, chatID int, filter chat.MessageFilter, pagination shared.TimeCursorPagination) ([]chat.ChatMessage, error)
	Update(ctx context.Context, chatID int, chat chat.UpdateChatParams) (chat.Chat, error)
	Create(ctx context.Context, params chat.CreateChatParams) (chat.Chat, error)
	Delete(ctx context.Context, id int) error
	GetById(ctx context.Context, chatID int) (chat.Chat, error)
	GetChatByAccountIds(ctx context.Context, accountIdOne int, accountIdTwo int) (chat.Chat, error)

	IsAccountInChat(ctx context.Context, chatID int, accountID int) (bool, error)
}

type RepositoryProvider interface {
	Account() AccountRepository
	Round() RoundRepository
	Investment() InvestmentRepository
	Chat() ChatRepository
	User() UserRepository
	Business() BusinessRepository
	Analytic() AnalyticRepository
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
}
