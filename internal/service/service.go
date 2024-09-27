package service

import (
	"context"

	"fundlevel/internal/entities/account"
	"fundlevel/internal/entities/round"
	"fundlevel/internal/entities/venture"
	accountService "fundlevel/internal/service/domain/account"
	healthService "fundlevel/internal/service/domain/health"
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
	GetManyByCursor(ctx context.Context, limit int, cursor int) ([]venture.Venture, error)
	GetManyByPage(ctx context.Context, limit int, page int) ([]venture.Venture, error)

	GetFixedTotalRoundsByCursor(ctx context.Context, ventureId int, limit int, cursor int) ([]round.FixedTotalRound, error)
	GetFixedTotalRoundsByPage(ctx context.Context, ventureId int, pageSize int, page int) ([]round.FixedTotalRound, error)

	GetRegularDynamicRoundsByCursor(ctx context.Context, ventureId int, limit int, cursor int) ([]round.RegularDynamicRound, error)
	GetRegularDynamicRoundsByPage(ctx context.Context, ventureId int, pageSize int, page int) ([]round.RegularDynamicRound, error)

	GetPartialTotalRoundsByCursor(ctx context.Context, ventureId int, limit int, cursor int) ([]round.PartialTotalRound, error)
	GetPartialTotalRoundsByPage(ctx context.Context, ventureId int, pageSize int, page int) ([]round.PartialTotalRound, error)

	GetDutchDynamicRoundsByCursor(ctx context.Context, ventureId int, limit int, cursor int) ([]round.DutchDynamicRound, error)
	GetDutchDynamicRoundsByPage(ctx context.Context, ventureId int, pageSize int, page int) ([]round.DutchDynamicRound, error)
}

type UserService interface {
	GetAccount(ctx context.Context, id uuid.UUID) (account.Account, error)
}

type AccountService interface {
	Create(ctx context.Context, params account.CreateAccountParams) (account.Account, error)
	Delete(ctx context.Context, id int) error
	Update(ctx context.Context, id int, params account.UpdateAccountParams) (account.Account, error)
	GetById(ctx context.Context, id int) (account.Account, error)

	GetVenturesByCursor(ctx context.Context, accountId int, limit int, cursor int) ([]venture.Venture, error)
	GetVenturesByPage(ctx context.Context, accountId int, pageSize int, page int) ([]venture.Venture, error)
}

type HealthService interface {
	HealthCheck(ctx context.Context) error
}

type RoundService interface {
	CreateFixedTotalRound(ctx context.Context, params round.CreateFixedTotalRoundParams) (round.FixedTotalRound, error)
	DeleteFixedTotalRound(ctx context.Context, id int) error
	GetFixedTotalById(ctx context.Context, id int) (round.FixedTotalRound, error)
	GetFixedTotalRoundsByCursor(ctx context.Context, limit int, cursor int) ([]round.FixedTotalRound, error)
	GetFixedTotalRoundsByPage(ctx context.Context, pageSize int, page int) ([]round.FixedTotalRound, error)

	CreateRegularDynamicRound(ctx context.Context, params round.CreateRegularDynamicRoundParams) (round.RegularDynamicRound, error)
	DeleteRegularDynamicRound(ctx context.Context, id int) error
	GetRegularDynamicById(ctx context.Context, id int) (round.RegularDynamicRound, error)
	GetRegularDynamicRoundsByCursor(ctx context.Context, limit int, cursor int) ([]round.RegularDynamicRound, error)
	GetRegularDynamicRoundsByPage(ctx context.Context, pageSize int, page int) ([]round.RegularDynamicRound, error)

	CreatePartialTotalRound(ctx context.Context, params round.CreatePartialTotalRoundParams) (round.PartialTotalRound, error)
	DeletePartialTotalRound(ctx context.Context, id int) error
	GetPartialTotalById(ctx context.Context, id int) (round.PartialTotalRound, error)
	GetPartialTotalRoundsByCursor(ctx context.Context, limit int, cursor int) ([]round.PartialTotalRound, error)
	GetPartialTotalRoundsByPage(ctx context.Context, pageSize int, page int) ([]round.PartialTotalRound, error)

	CreateDutchDynamicRound(ctx context.Context, params round.CreateDutchDynamicRoundParams) (round.DutchDynamicRound, error)
	DeleteDutchDynamicRound(ctx context.Context, id int) error
	GetDutchDynamicById(ctx context.Context, id int) (round.DutchDynamicRound, error)
	GetDutchDynamicRoundsByCursor(ctx context.Context, limit int, cursor int) ([]round.DutchDynamicRound, error)
	GetDutchDynamicRoundsByPage(ctx context.Context, pageSize int, page int) ([]round.DutchDynamicRound, error)
}

type Service struct {
	VentureService VentureService
	RoundService   RoundService
	AccountService AccountService
	HealthService  HealthService
	UserService    UserService
}

// NewService implementation for storage of all services.
func NewService(
	repositories storage.Repository,
) *Service {
	return &Service{
		VentureService: ventureService.NewVentureService(repositories),
		HealthService:  healthService.NewHealthService(repositories),
		AccountService: accountService.NewAccountService(repositories),
		UserService:    userService.NewUserService(repositories),
		RoundService:   roundService.NewRoundService(repositories),
	}
}
