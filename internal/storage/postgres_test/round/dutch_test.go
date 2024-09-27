package round_test

import (
	"context"
	"testing"
	"time"

	entities "fundlevel/internal/entities/round"
	"fundlevel/internal/storage/postgres/round"
	"fundlevel/internal/storage/postgres/shared"
	"fundlevel/internal/storage/postgres_test/seed"
	"fundlevel/internal/storage/postgres_test/util"

	"github.com/stretchr/testify/assert"
)

func TestCreateDutchDynamicRound(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(12),
		seed.WithVentures(10),
		seed.WithDutchDynamicRounds(0),
	)

	db, seedResult := util.SetupTestDB(t, seedConfig)

	repo := round.NewRoundRepository(db, ctx)

	ventureID := seedResult.VentureIds[0]

	params := entities.CreateDutchDynamicRoundParams{
		DutchDynamicRound: entities.DutchDynamicRoundParams{
			ValuationDollarDropRate:   10,
			ValuationStopLoss:         10000,
			ValuationDropIntervalDays: 1,
		},
		Round: entities.CreateRoundParams{
			VentureID:         ventureID,
			BeginsAt:          time.Now().Add(time.Hour * 24),
			PercentageOffered: 10.0,
			PercentageValue:   10000,
			ValueCurrency:     entities.USD,
			Status:            entities.Active,
		},
	}

	params.Round.EndsAt = params.Round.BeginsAt.Add(time.Hour * 24 * 60)

	createdRound, err := repo.CreateDutchDynamicRound(ctx, params)

	assert.NoError(t, err)

	assert.Equal(t, createdRound.Round.VentureID, params.Round.VentureID)
	assert.Equal(t, createdRound.Round.PercentageOffered, params.Round.PercentageOffered)
	assert.Equal(t, createdRound.Round.PercentageValue, params.Round.PercentageValue)
	assert.Equal(t, createdRound.Round.ValueCurrency, params.Round.ValueCurrency)
	assert.Equal(t, createdRound.Round.Status, params.Round.Status)
	assert.Equal(t, createdRound.Round.BeginsAt.UTC(), params.Round.BeginsAt.UTC())
	assert.Equal(t, createdRound.Round.EndsAt.UTC(), params.Round.EndsAt.UTC())
	assert.Equal(t, createdRound.ValuationDollarDropRate, params.DutchDynamicRound.ValuationDollarDropRate)
	assert.Equal(t, createdRound.ValuationStopLoss, params.DutchDynamicRound.ValuationStopLoss)
	assert.Equal(t, createdRound.ValuationDropIntervalDays, params.DutchDynamicRound.ValuationDropIntervalDays)
}

func TestDeleteDutchDynamicRound(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(12),
		seed.WithVentures(10),
		seed.WithDutchDynamicRounds(1),
	)

	db, seedResult := util.SetupTestDB(t, seedConfig)

	repo := round.NewRoundRepository(db, ctx)

	ventureID := 1
	if _, ok := seedResult.VentureDutchDynamicRounds[ventureID]; !ok {
		t.Fatalf("Round not found for venture %d", ventureID)
	}

	roundID := seedResult.VentureDutchDynamicRounds[ventureID][0].RoundID

	err := repo.DeleteDutchDynamicRound(ctx, roundID)

	assert.NoError(t, err)
}

func TestGetDutchDynamicRoundById(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(12),
		seed.WithVentures(10),
		seed.WithDutchDynamicRounds(1),
	)

	db, seedResult := util.SetupTestDB(t, seedConfig)

	repo := round.NewRoundRepository(db, ctx)

	ventureID := 1
	if _, ok := seedResult.VentureDutchDynamicRounds[ventureID]; !ok {
		t.Fatalf("Round not found for venture %d", ventureID)
	}

	roundID := seedResult.VentureDutchDynamicRounds[ventureID][0].RoundID

	fetchedRound, err := repo.GetDutchDynamicRoundById(ctx, roundID)

	assert.NoError(t, err)

	assert.Equal(t, roundID, fetchedRound.Round.ID)
}

func TestGetDutchDynamicRoundsByCursor(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(12),
		seed.WithVentures(10),
		seed.WithDutchDynamicRounds(30),
	)

	db, _ := util.SetupTestDB(t, seedConfig)

	repo := round.NewRoundRepository(db, ctx)

	params := shared.CursorPagination{
		Limit: 21,
	}

	rounds, err := repo.GetDutchDynamicRoundsByCursor(ctx, params)
	assert.NoError(t, err)

	assert.Len(t, rounds, 21)

	for _, round := range rounds {
		assert.NotNil(t, round.Round)
	}

	params.Cursor = rounds[params.Limit-1].Round.ID
	rounds, err = repo.GetDutchDynamicRoundsByCursor(ctx, params)

	assert.NoError(t, err)
	assert.Len(t, rounds, 10)
	for _, round := range rounds {
		assert.NotNil(t, round.Round)
	}

	assert.Equal(t, rounds[0].Round.ID, params.Cursor)

}

func TestGetDutchDynamicRoundsByPage(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(12),
		seed.WithVentures(1),
		seed.WithDutchDynamicRounds(100),
	)

	db, _ := util.SetupTestDB(t, seedConfig)

	repo := round.NewRoundRepository(db, ctx)

	params := shared.OffsetPagination{
		Page:     1,
		PageSize: 20,
	}

	rounds, err := repo.GetDutchDynamicRoundsByPage(ctx, params)
	assert.NoError(t, err)

	assert.Len(t, rounds, 21)

	for _, round := range rounds {
		assert.NotNil(t, round.Round)
	}
	params.Page = 2

	rounds, err = repo.GetDutchDynamicRoundsByPage(ctx, params)

	assert.NoError(t, err)
	assert.Len(t, rounds, 21)
	for _, round := range rounds {
		assert.NotNil(t, round.Round)
	}

	params.Page = 5

	rounds, err = repo.GetDutchDynamicRoundsByPage(ctx, params)

	assert.NoError(t, err)
	assert.Len(t, rounds, 20)
	for _, round := range rounds {
		assert.NotNil(t, round.Round)
	}
}
