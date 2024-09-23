package offer_test

import (
	"context"
	"fundlevel/internal/entities/offer"
	"fundlevel/internal/service/domain_test/util"
	"fundlevel/internal/storage/postgres_test/seed"
	"testing"
)

func TestCreateStatic(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithNumUsers(1),
		seed.WithNumVentures(1),
	)

	service, seedResult := util.SetupTestService(t, seedConfig, ctx)

	staticOfferParams := offer.CreateStaticRoundOfferParams{}
	staticOfferParams.StaticRoundID = seedResult.StaticRoundIds[0]

	offerParams := offer.CreateOfferParams{}
	offerParams.MonetaryInvestmentValue = 100000
	offerParams.Status = offer.OfferStatusPending
	offerParams.InvestorAccountID = 1

	output, err := service.OfferService.CreateStatic(
		ctx,
		staticOfferParams,
		offerParams,
	)
	if err != nil {
		t.Fatalf("Error creating static round offer: %v", err)
	}

	t.Logf("Round: %v", output)
}
