package domain

import (
	"ummah-growth/api/internal/service"
	"ummah-growth/api/internal/service/domain/foo"
	"ummah-growth/api/internal/service/domain/health"
	"ummah-growth/api/internal/service/domain/account"
	"ummah-growth/api/internal/storage"
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
