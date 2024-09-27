package round_test

import (
	"context"
	"fundlevel/internal/entities/round"
	"fundlevel/internal/service/domain_test/util"
	"fundlevel/internal/storage/postgres_test/seed"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestGetDutchDynamicById(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(1),
		seed.WithVentures(1),
		seed.WithDutchDynamicRounds(1),
	)

	service, seedResult := util.SetupTestService(t, seedConfig, ctx)
	ventureID := seedResult.VentureIds[0]
	if _, ok := seedResult.VentureDutchDynamicRounds[ventureID]; !ok {
		t.Fatalf("VentureDutchDynamicRounds not found in seedResult")
	}

	roundID := seedResult.VentureDutchDynamicRounds[ventureID][0].RoundID

	output, err := service.RoundService.GetDutchDynamicById(
		ctx,
		roundID,
	)

	assert.NoError(t, err)
	assert.Equal(t, roundID, output.Round.ID)
	assert.Equal(t, ventureID, output.Round.VentureID)
	assert.Equal(t, output.RoundID, output.Round.ID)
}

func TestGetDutchDynamicRoundsByCursor(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(1),
		seed.WithVentures(1),
		seed.WithDutchDynamicRounds(15),
	)

	service, seedResult := util.SetupTestService(t, seedConfig, ctx)
	ventureID := seedResult.VentureIds[0]

	output, err := service.RoundService.GetDutchDynamicRoundsByCursor(
		ctx,
		10,
		1,
	)
	assert.NoError(t, err)
	assert.Len(t, output, 10)
	for _, round := range output {
		assert.Equal(t, ventureID, round.Round.VentureID)
	}

	cursor := output[len(output)-1].RoundID
	output, err = service.RoundService.GetDutchDynamicRoundsByCursor(
		ctx,
		10,
		cursor,
	)

	assert.NoError(t, err)
	assert.Len(t, output, 6)
	for _, round := range output {
		assert.Equal(t, ventureID, round.Round.VentureID)
	}

	assert.Equal(t, cursor, output[0].Round.ID)
}

func TestGetDutchDynamicRoundsByPage(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(1),
		seed.WithVentures(1),
		seed.WithDutchDynamicRounds(15),
	)

	service, seedResult := util.SetupTestService(t, seedConfig, ctx)
	ventureID := seedResult.VentureIds[0]

	output, err := service.RoundService.GetDutchDynamicRoundsByPage(
		ctx,
		10,
		1,
	)
	assert.NoError(t, err)

	assert.Len(t, output, 11)
	for _, round := range output {
		assert.Equal(t, ventureID, round.Round.VentureID)
	}

	lastRoundID := output[len(output)-1].RoundID
	output, err = service.RoundService.GetDutchDynamicRoundsByPage(
		ctx,
		10,
		2,
	)

	assert.NoError(t, err)
	assert.Len(t, output, 5)
	for _, round := range output {
		assert.Equal(t, ventureID, round.Round.VentureID)
	}

	assert.Equal(t, lastRoundID, output[0].Round.ID)
	assert.Less(t, lastRoundID, output[1].Round.ID)
}

func TestCreateDutchDynamicRound(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(1),
		seed.WithVentures(1),
		seed.WithDutchDynamicRounds(0),
	)

	service, seedResult := util.SetupTestService(t, seedConfig, ctx)

	params := round.CreateDutchDynamicRoundParams{
		DutchDynamicRound: round.DutchDynamicRoundParams{
			ValuationDollarDropRate:   10,
			ValuationStopLoss:         1000000,
			ValuationDropIntervalDays: 1,
		},
		Round: round.CreateRoundParams{
			VentureID:         seedResult.VentureIds[0],
			BeginsAt:          time.Now().Add(time.Hour * 24),
			PercentageOffered: 10.5,
			PercentageValue:   180000,
			ValueCurrency:     round.USD,
			Status:            round.Active,
		},
	}

	params.Round.EndsAt = params.Round.BeginsAt.Add(time.Hour * 24 * 7)

	output, err := service.RoundService.CreateDutchDynamicRound(
		ctx,
		params,
	)

	assert.NoError(t, err)
	assert.Equal(t, output.Round.VentureID, params.Round.VentureID)
	assert.Equal(t, output.Round.PercentageOffered, params.Round.PercentageOffered)
	assert.Equal(t, output.Round.PercentageValue, params.Round.PercentageValue)
	assert.Equal(t, output.Round.ValueCurrency, params.Round.ValueCurrency)
	assert.Equal(t, output.Round.Status, params.Round.Status)
	assert.Equal(t, output.Round.BeginsAt.UTC(), params.Round.BeginsAt.UTC())
	assert.Equal(t, output.Round.EndsAt.UTC(), params.Round.EndsAt.UTC())
	assert.Equal(t, output.ValuationDollarDropRate, params.DutchDynamicRound.ValuationDollarDropRate)
	assert.Equal(t, output.ValuationStopLoss, params.DutchDynamicRound.ValuationStopLoss)
	assert.Equal(t, output.ValuationDropIntervalDays, params.DutchDynamicRound.ValuationDropIntervalDays)
}

func TestDeleteDutchDynamicRound(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(1),
		seed.WithVentures(1),
		seed.WithDutchDynamicRounds(1),
	)

	service, seedResult := util.SetupTestService(t, seedConfig, ctx)
	ventureID := seedResult.VentureIds[0]
	if _, ok := seedResult.VentureDutchDynamicRounds[ventureID]; !ok {
		t.Fatalf("VentureDutchDynamicRounds not found in seedResult")
	}

	roundID := seedResult.VentureDutchDynamicRounds[ventureID][0].RoundID

	err := service.RoundService.DeleteDutchDynamicRound(
		ctx,
		roundID,
	)

	assert.NoError(t, err)
}
