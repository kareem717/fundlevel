package domain

import (
	"fundlevel/internal/service"
	"fundlevel/internal/service/domain/foo"
	"fundlevel/internal/service/domain/health"
	"fundlevel/internal/service/domain/account"
	"fundlevel/internal/storage"
)

// NewService implementation for storage of all services.
func NewService(
	repositories storage.Repository,
) *service.Service {
	return &service.Service{
		FooService:    foo.NewFooService(repositories),
		HealthService: health.NewHealthService(repositories),
		AccountService: account.NewAccountService(repositories),
	}
}
