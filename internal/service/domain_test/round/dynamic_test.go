package round_test

import (
	"context"
	"fundlevel/internal/entities/round"
	"fundlevel/internal/service/domain_test/util"
	"fundlevel/internal/storage/postgres_test/seed"
	"testing"
	"time"
)

func TestCreateDynamic(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithNumUsers(1),
		seed.WithNumVentures(1),
	)

	service, _ := util.SetupTestService(t, seedConfig, ctx)

	roundParams := round.CreateRoundParams{
		VentureID:               1,
		OfferedPercentage:       15,
		MonetaryPercentageValue: 100000,
		MonetaryValueCurrency:   round.USD,
		BeginsAt:                time.Now().Add(time.Hour * 24),
	}

	dynamicParams := round.CreateDynamicRoundParams{}
	dynamicParams.MinimumMonetaryInvestmentValue = 100000
	dynamicParams.EndsAt = time.Now().Add(time.Hour * 346)

	output, err := service.RoundService.CreateDynamic(
		ctx,
		dynamicParams,
		roundParams,
	)
	if err != nil {
		t.Fatalf("Error creating dynamic round: %v", err)
	}

	t.Logf("Round: %v", output)
}
