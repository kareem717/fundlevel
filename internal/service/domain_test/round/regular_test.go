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

func TestGetRegularDynamicById(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(1),
		seed.WithVentures(1),
		seed.WithRegularDynamicRounds(1),
	)

	service, seedResult := util.SetupTestService(t, seedConfig, ctx)
	ventureID := seedResult.VentureIds[0]
	if _, ok := seedResult.VentureRegularDynamicRounds[ventureID]; !ok {
		t.Fatalf("VentureRegularDynamicRounds not found in seedResult")
	}

	roundID := seedResult.VentureRegularDynamicRounds[ventureID][0].RoundID

	output, err := service.RoundService.GetRegularDynamicById(
		ctx,
		roundID,
	)

	assert.NoError(t, err)
	assert.Equal(t, roundID, output.Round.ID)
	assert.Equal(t, ventureID, output.Round.VentureID)
	assert.Equal(t, output.RoundID, output.Round.ID)
}

func TestGetRegularDynamicRoundsByCursor(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(1),
		seed.WithVentures(1),
		seed.WithRegularDynamicRounds(15),
	)

	service, _ := util.SetupTestService(t, seedConfig, ctx)

	output, err := service.RoundService.GetRegularDynamicRoundsByCursor(
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
	output, err = service.RoundService.GetRegularDynamicRoundsByCursor(
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

func TestGetRegularDynamicRoundsByPage(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(1),
		seed.WithVentures(1),
		seed.WithRegularDynamicRounds(15),
	)

	service, seedResult := util.SetupTestService(t, seedConfig, ctx)
	ventureID := seedResult.VentureIds[0]

	output, err := service.RoundService.GetRegularDynamicRoundsByPage(
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
	output, err = service.RoundService.GetRegularDynamicRoundsByPage(
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

func TestCreateRegularDynamicRound(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(1),
		seed.WithVentures(1),
		seed.WithRegularDynamicRounds(0),
	)

	service, seedResult := util.SetupTestService(t, seedConfig, ctx)

	params := round.CreateRegularDynamicRoundParams{}
	params.Round.VentureID = seedResult.VentureIds[0]
	params.Round.BeginsAt = time.Now().Add(time.Hour * 24)
	params.Round.EndsAt = params.Round.BeginsAt.Add(time.Hour * 24 * 7)
	params.Round.PercentageOffered = 10.5
	params.Round.PercentageValue = 180000
	params.Round.ValueCurrency = round.USD
	params.Round.Status = round.Active

	output, err := service.RoundService.CreateRegularDynamicRound(
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

func TestDeleteRegularDynamicRound(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(1),
		seed.WithVentures(1),
		seed.WithRegularDynamicRounds(1),
	)

	service, seedResult := util.SetupTestService(t, seedConfig, ctx)
	ventureID := seedResult.VentureIds[0]
	if _, ok := seedResult.VentureRegularDynamicRounds[ventureID]; !ok {
		t.Fatalf("VentureRegularDynamicRounds not found in seedResult")
	}

	roundID := seedResult.VentureRegularDynamicRounds[ventureID][0].RoundID

	err := service.RoundService.DeleteRegularDynamicRound(
		ctx,
		roundID,
	)

	assert.NoError(t, err)
}
