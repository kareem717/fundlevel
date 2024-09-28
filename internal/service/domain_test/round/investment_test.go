package round_test

import (
	"context"
	"fundlevel/internal/entities/investment"
	"fundlevel/internal/service/domain_test/util"
	"fundlevel/internal/storage/postgres_test/seed"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestAcceptRoundInvestment(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(1),
		seed.WithVentures(1),
		seed.WithFixedTotalRounds(1),
		seed.WithRoundInvestments(100),
	)

	service, seedResult := util.SetupTestService(t, seedConfig, ctx)
	ventureID := seedResult.VentureIds[0]
	roundID := seedResult.VentureFixedTotalRounds[ventureID][0].RoundID
	investments := seedResult.RoundInvestments[roundID]

	var acceptableId int
	for _, i := range investments {
		if i.Status == investment.InvestmentStatusPending {
			acceptableId = i.ID
			break
		}
	}

	err := service.RoundService.AcceptRoundInvestment(
		ctx,
		roundID,
		acceptableId,
	)

	assert.NoError(t, err)
}

func TestGetRoundInvestmentsByCursor(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(1),
		seed.WithVentures(1),
		seed.WithFixedTotalRounds(1),
		seed.WithDutchDynamicRounds(1),
		seed.WithRegularDynamicRounds(1),
		seed.WithPartialTotalRounds(1),
		seed.WithRoundInvestments(60),
	)

	service, seedResult := util.SetupTestService(t, seedConfig, ctx)
	ventureID := seedResult.VentureIds[0]
	roundID := seedResult.VentureFixedTotalRounds[ventureID][0].RoundID
	investments := seedResult.RoundInvestments[roundID]

	output, err := service.RoundService.GetRoundInvestmentsByCursor(
		ctx,
		roundID,
		10,
		investments[0].ID,
	)

	assert.NoError(t, err)
	assert.Len(t, output, 10)
	for _, round := range output {
		assert.Nil(t, round.Round)
		assert.NotNil(t, round.Investor)
	}

	cursor := output[len(output)-1].ID
	output, err = service.RoundService.GetRoundInvestmentsByCursor(
		ctx,
		roundID,
		10,
		cursor,
	)

	assert.NoError(t, err)
	assert.Len(t, output, 6)
	for _, round := range output {
		assert.Nil(t, round.Round)
		assert.NotNil(t, round.Investor)
	}

	assert.Equal(t, cursor, output[0].ID)
}

func TestGetRoundInvestmentsByPage(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(1),
		seed.WithVentures(1),
		seed.WithFixedTotalRounds(1),
		seed.WithDutchDynamicRounds(1),
		seed.WithRegularDynamicRounds(1),
		seed.WithPartialTotalRounds(1),
		seed.WithRoundInvestments(60),
	)

	service, seedResult := util.SetupTestService(t, seedConfig, ctx)
	ventureID := seedResult.VentureIds[0]
	roundID := seedResult.VentureFixedTotalRounds[ventureID][0].RoundID

	output, err := service.RoundService.GetRoundInvestmentsByPage(
		ctx,
		roundID,
		10,
		1,
	)
	assert.NoError(t, err)

	assert.Len(t, output, 11)
	for _, round := range output {
		assert.Nil(t, round.Round)
		assert.NotNil(t, round.Investor)
	}

	lastInvestmentID := output[len(output)-1].ID
	output, err = service.RoundService.GetRoundInvestmentsByPage(
		ctx,
		roundID,
		10,
		2,
	)

	assert.NoError(t, err)
	assert.Len(t, output, 5)
	for _, round := range output {
		assert.Nil(t, round.Round)
		assert.NotNil(t, round.Investor)
	}

	assert.Equal(t, lastInvestmentID, output[0].ID)
	assert.Less(t, lastInvestmentID, output[1].ID)
}
