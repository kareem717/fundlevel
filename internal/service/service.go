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

	GetRoundsByCursor(ctx context.Context, ventureId int, limit int, cursor int) ([]round.Round, error)
	GetRoundsByPage(ctx context.Context, ventureId int, pageSize int, page int) ([]round.Round, error)
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
	Create(ctx context.Context, params round.CreateRoundParams) (round.Round, error)
	Delete(ctx context.Context, id int) error
	GetById(ctx context.Context, id int) (round.Round, error)
	GetManyByCursor(ctx context.Context, limit int, cursor int) ([]round.Round, error)
	GetManyByPage(ctx context.Context, pageSize int, page int) ([]round.Round, error)
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
