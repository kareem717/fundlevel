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

func TestCreate(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(12),
		seed.WithVentures(10),
		seed.WithRounds(0),
	)

	db, seedResult := util.SetupTestDB(t, seedConfig)

	repo := round.NewRoundRepository(db, ctx)

	ventureID := seedResult.VentureIds[0]

	params := entities.CreateRoundParams{
		VentureID:         ventureID,
		BeginsAt:          time.Now().Add(time.Hour * 24),
		PercentageOffered: 10.0,
		PercentageValue:   10000,
		ValueCurrency:     entities.USD,
		Status:            entities.Active,
	}

	params.EndsAt = params.BeginsAt.Add(time.Hour * 24 * 60)

	createdRound, err := repo.Create(ctx, params)

	assert.NoError(t, err)

	assert.Equal(t, createdRound.VentureID, params.VentureID)
	assert.Equal(t, createdRound.PercentageOffered, params.PercentageOffered)
	assert.Equal(t, createdRound.PercentageValue, params.PercentageValue)
	assert.Equal(t, createdRound.ValueCurrency, params.ValueCurrency)
	assert.Equal(t, createdRound.Status, params.Status)
	assert.Equal(t, createdRound.BeginsAt.UTC(), params.BeginsAt.UTC())
	assert.Equal(t, createdRound.EndsAt.UTC(), params.EndsAt.UTC())
	assert.Nil(t, createdRound.RegularDynamicRoundID)
}

func TestDelete(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(12),
		seed.WithVentures(10),
		seed.WithRounds(1),
	)

	db, seedResult := util.SetupTestDB(t, seedConfig)

	repo := round.NewRoundRepository(db, ctx)

	ventureID := 1
	if _, ok := seedResult.VentureRounds[ventureID]; !ok {
		t.Fatalf("Round not found for venture %d", ventureID)
	}

	roundID := seedResult.VentureRounds[ventureID][0].RoundID

	err := repo.Delete(ctx, roundID)

	assert.NoError(t, err)
}

func TestGetById(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(12),
		seed.WithVentures(10),
		seed.WithRounds(1),
	)

	db, seedResult := util.SetupTestDB(t, seedConfig)

	repo := round.NewRoundRepository(db, ctx)

	ventureID := 1
	if _, ok := seedResult.VentureRounds[ventureID]; !ok {
		t.Fatalf("Round not found for venture %d", ventureID)
	}

	roundID := seedResult.VentureRounds[ventureID][0].RoundID

	fetchedRound, err := repo.GetById(ctx, roundID)

	assert.NoError(t, err)

	assert.Equal(t, roundID, fetchedRound.ID)
	assert.Nil(t, fetchedRound.RegularDynamicRoundID)
}

func TestGetMany(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(12),
		seed.WithVentures(10),
		seed.WithRounds(1000),
	)

	db, _ := util.SetupTestDB(t, seedConfig)

	repo := round.NewRoundRepository(db, ctx)

	params := shared.PaginationRequest{
		Limit: 20,
	}

	rounds, err := repo.GetMany(ctx, params)
	assert.NoError(t, err)

	assert.Len(t, rounds, 20)

	params.Cursor = rounds[len(rounds)-1].ID

	rounds, err = repo.GetMany(ctx, params)

	assert.NoError(t, err)
	assert.Len(t, rounds, 20)

	assert.Equal(t, rounds[0].ID, params.Cursor)

	for _, round := range rounds {
		assert.Nil(t, round.RegularDynamicRoundID)
	}
}
