package util

import (
	"context"
	"fundlevel/internal/service"
	"fundlevel/internal/service/domain/billing"
	"fundlevel/internal/storage/postgres"
	"fundlevel/internal/storage/postgres_test/seed"
	"fundlevel/internal/storage/postgres_test/util"
	"testing"
)

// SetupTestService sets up a test service with a test database.
// It will fatal if error
func SetupTestService(t *testing.T, dbSeedConfig seed.SeedConfig, ctx context.Context) (*service.Service, *seed.SeedResult) {
	// will fatal if error
	db, seedResult := util.SetupTestDB(t, dbSeedConfig)

	repo := postgres.NewRepository(db, ctx)

	service := service.NewService(repo, billing.BillingServiceConfig{
		StripeAPIKey:    "test",
		FeePercentage: 0.033333,
	})

	return service, seedResult
}
