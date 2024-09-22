package util

import (
	"context"
	"fundlevel/internal/service"
	"fundlevel/internal/storage/postgres"
	"fundlevel/internal/storage/postgres_test/seed"
	"fundlevel/internal/storage/postgres_test/util"
	"testing"
)

// SetupTestService sets up a test service with a test database.
// It will fatal if error
func SetupTestService(t *testing.T, dbSeedConfig seed.SeedConfig, ctx context.Context) *service.Service {
	// will fatal if error
	db, _ := util.SetupTestDB(t, dbSeedConfig)

	repo := postgres.NewRepository(db, ctx)

	service := service.NewService(repo)

	return service
}
