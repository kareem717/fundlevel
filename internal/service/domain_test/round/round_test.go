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

func TestGetFixedTotalById(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(1),
		seed.WithVentures(1),
		seed.WithFixedTotalRounds(1),
	)

	service, _ := util.SetupTestService(t, seedConfig, ctx)

	output, err := service.RoundService.GetFixedTotalById(
		ctx,
		1,
	)

	assert.NoError(t, err)
	assert.Equal(t, 1, output.Round.ID)
	assert.Equal(t, 1, output.Round.VentureID)
	assert.Equal(t, output.RoundID, output.Round.ID)
}

func TestGetFixedTotalRoundsByCursor(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(1),
		seed.WithVentures(1),
		seed.WithFixedTotalRounds(15),
	)

	service, _ := util.SetupTestService(t, seedConfig, ctx)

	output, err := service.RoundService.GetFixedTotalRoundsByCursor(
		ctx,
		10,
		1,
	)
	assert.NoError(t, err)
	assert.Len(t, output, 10)
	for _, round := range output {
		assert.Equal(t, 1, round.Round.VentureID)
	}

	cursor := output[len(output)-1].RoundID
	output, err = service.RoundService.GetFixedTotalRoundsByCursor(
		ctx,
		10,
		cursor,
	)

	assert.NoError(t, err)
	assert.Len(t, output, 6)
	for _, round := range output {
		assert.Equal(t, 1, round.Round.VentureID)
	}

	assert.Equal(t, cursor, output[0].Round.ID)
}

func TestGetFixedTotalRoundsByPage(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(1),
		seed.WithVentures(1),
		seed.WithFixedTotalRounds(15),
	)

	service, _ := util.SetupTestService(t, seedConfig, ctx)

	output, err := service.RoundService.GetFixedTotalRoundsByPage(
		ctx,
		10,
		1,
	)
	assert.NoError(t, err)

	assert.Len(t, output, 10)
	for _, round := range output {
		assert.Equal(t, 1, round.Round.VentureID)
	}

	lastRoundID := output[len(output)-1].RoundID
	output, err = service.RoundService.GetFixedTotalRoundsByPage(
		ctx,
		10,
		2,
	)

	assert.NoError(t, err)
	assert.Len(t, output, 5)
	for _, round := range output {
		assert.Equal(t, 1, round.Round.VentureID)
	}

	assert.Less(t, lastRoundID, output[0].Round.ID)
}

func TestCreateFixedTotalRound(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(1),
		seed.WithVentures(1),
		seed.WithFixedTotalRounds(0),
	)

	service, seedResult := util.SetupTestService(t, seedConfig, ctx)

	params := round.CreateFixedTotalRoundParams{}
	params.Round.VentureID = seedResult.VentureIds[0]
	params.Round.BeginsAt = time.Now().Add(time.Hour * 24)
	params.Round.EndsAt = params.Round.BeginsAt.Add(time.Hour * 24 * 7)
	params.Round.PercentageOffered = 10.5
	params.Round.PercentageValue = 180000
	params.Round.ValueCurrency = round.USD
	params.Round.Status = round.Active

	output, err := service.RoundService.CreateFixedTotalRound(
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
}

func TestDeleteFixedTotalRound(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(1),
		seed.WithVentures(1),
		seed.WithFixedTotalRounds(1),
	)

	service, _ := util.SetupTestService(t, seedConfig, ctx)

	err := service.RoundService.DeleteFixedTotalRound(
		ctx,
		1,
	)

	assert.NoError(t, err)
}
