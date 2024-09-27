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

func TestCreateFixedTotalRound(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(12),
		seed.WithVentures(10),
		seed.WithFixedTotalRounds(0),
	)

	db, seedResult := util.SetupTestDB(t, seedConfig)

	repo := round.NewRoundRepository(db, ctx)

	ventureID := seedResult.VentureIds[0]

	params := entities.CreateFixedTotalRoundParams{
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

	createdRound, err := repo.CreateFixedTotalRound(ctx, params)

	assert.NoError(t, err)

	assert.Equal(t, createdRound.Round.VentureID, params.Round.VentureID)
	assert.Equal(t, createdRound.Round.PercentageOffered, params.Round.PercentageOffered)
	assert.Equal(t, createdRound.Round.PercentageValue, params.Round.PercentageValue)
	assert.Equal(t, createdRound.Round.ValueCurrency, params.Round.ValueCurrency)
	assert.Equal(t, createdRound.Round.Status, params.Round.Status)
	assert.Equal(t, createdRound.Round.BeginsAt.UTC(), params.Round.BeginsAt.UTC())
	assert.Equal(t, createdRound.Round.EndsAt.UTC(), params.Round.EndsAt.UTC())
}

func TestDeleteFixedTotalRound(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(12),
		seed.WithVentures(10),
		seed.WithFixedTotalRounds(1),
	)

	db, seedResult := util.SetupTestDB(t, seedConfig)

	repo := round.NewRoundRepository(db, ctx)

	ventureID := 1
	if _, ok := seedResult.VentureFixedTotalRounds[ventureID]; !ok {
		t.Fatalf("Round not found for venture %d", ventureID)
	}

	roundID := seedResult.VentureFixedTotalRounds[ventureID][0].RoundID

	err := repo.DeleteFixedTotalRound(ctx, roundID)

	assert.NoError(t, err)
}

func TestGetFixedTotalRoundById(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(12),
		seed.WithVentures(10),
		seed.WithFixedTotalRounds(1),
	)

	db, seedResult := util.SetupTestDB(t, seedConfig)

	repo := round.NewRoundRepository(db, ctx)

	ventureID := 1
	if _, ok := seedResult.VentureFixedTotalRounds[ventureID]; !ok {
		t.Fatalf("Round not found for venture %d", ventureID)
	}

	roundID := seedResult.VentureFixedTotalRounds[ventureID][0].RoundID

	fetchedRound, err := repo.GetFixedTotalRoundById(ctx, roundID)

	assert.NoError(t, err)

	assert.Equal(t, roundID, fetchedRound.Round.ID)
}

func TestGetFixedTotalRoundsByCursor(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(12),
		seed.WithVentures(10),
		seed.WithFixedTotalRounds(30),
	)

	db, _ := util.SetupTestDB(t, seedConfig)

	repo := round.NewRoundRepository(db, ctx)

	params := shared.CursorPagination{
		Limit: 21,
	}

	rounds, err := repo.GetFixedTotalRoundsByCursor(ctx, params)
	assert.NoError(t, err)

	assert.Len(t, rounds, 21)

	for _, round := range rounds {
		assert.NotNil(t, round.Round)
	}

	params.Cursor = rounds[params.Limit-1].Round.ID
	rounds, err = repo.GetFixedTotalRoundsByCursor(ctx, params)

	assert.NoError(t, err)
	assert.Len(t, rounds, 10)
	for _, round := range rounds {
		assert.NotNil(t, round.Round)
	}

	assert.Equal(t, rounds[0].Round.ID, params.Cursor)

}

func TestGetFixedTotalRoundsByPage(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(12),
		seed.WithVentures(1),
		seed.WithFixedTotalRounds(100),
	)

	db, _ := util.SetupTestDB(t, seedConfig)

	repo := round.NewRoundRepository(db, ctx)

	params := shared.OffsetPagination{
		Page:     1,
		PageSize: 20,
	}

	rounds, err := repo.GetFixedTotalRoundsByPage(ctx, params)
	assert.NoError(t, err)

	assert.Len(t, rounds, 21)

	for _, round := range rounds {
		assert.NotNil(t, round.Round)
	}
	params.Page = 2

	rounds, err = repo.GetFixedTotalRoundsByPage(ctx, params)

	assert.NoError(t, err)
	assert.Len(t, rounds, 21)
	for _, round := range rounds {
		assert.NotNil(t, round.Round)
	}

	params.Page = 5

	rounds, err = repo.GetFixedTotalRoundsByPage(ctx, params)

	assert.NoError(t, err)
	assert.Len(t, rounds, 20)
	for _, round := range rounds {
		assert.NotNil(t, round.Round)
	}
}
