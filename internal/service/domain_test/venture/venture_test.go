package venture_test

import (
	"context"
	"fundlevel/internal/service/domain_test/util"
	"fundlevel/internal/storage/postgres_test/seed"
	"testing"
)

func TestGetById(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithNumUsers(1),
	)

	service := util.SetupTestService(t, seedConfig, ctx)

	venture, err := service.VentureService.GetById(ctx, 1)
	if err != nil {
		t.Fatalf("Error getting venture by id: %v", err)
	}

	t.Logf("Venture: %v", venture)
}
