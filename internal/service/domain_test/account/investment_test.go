package account_test

import (
	"context"
	"fundlevel/internal/entities/investment"
	"fundlevel/internal/service/domain_test/util"
	"fundlevel/internal/storage/postgres_test/seed"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestWithdrawRoundInvestment(t *testing.T) {
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

func TestDeleteRoundInvestment(t *testing.T) {
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

	err := service.AccountService.DeleteRoundInvestment(
		ctx,
		1,
		investments[0].ID,
	)

	assert.NoError(t, err)
}

func TestCreateRoundInvestment(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(1),
		seed.WithVentures(1),
		seed.WithFixedTotalRounds(1),
		seed.WithRoundInvestments(0),
	)

	service, seedResult := util.SetupTestService(t, seedConfig, ctx)
	ventureID := seedResult.VentureIds[0]
	roundID := seedResult.VentureFixedTotalRounds[ventureID][0].RoundID

	params := investment.CreateInvestmentParams{
		RoundID:    roundID,
		Amount:     100,
		InvestorID: 1,
	}
	params.Status = investment.InvestmentStatusPending

	res, err := service.AccountService.CreateRoundInvestment(
		ctx,
		params,
	)

	assert.NoError(t, err)
	assert.Equal(t, params.RoundID, res.RoundID)
	assert.Equal(t, params.Amount, res.Amount)
	assert.Equal(t, params.InvestorID, res.InvestorID)
	assert.Equal(t, params.Status, res.Status)
	assert.Nil(t, res.Round)
	assert.Nil(t, res.Investor)
}

func TestGetRoundInvestmentsByCursor(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(1),
		seed.WithRoundInvestments(60),
	)

	service, _ := util.SetupTestService(t, seedConfig, ctx)

	output, err := service.AccountService.GetRoundInvestmentsByCursor(
		ctx,
		1,
		10,
		1,
	)

	assert.NoError(t, err)
	assert.Len(t, output, 10)
	for _, round := range output {
		assert.NotNil(t, round.Round)
		assert.Nil(t, round.Investor)
	}

	cursor := output[len(output)-1].ID
	output, err = service.AccountService.GetRoundInvestmentsByCursor(
		ctx,
		1,
		10,
		cursor,
	)

	assert.NoError(t, err)
	assert.Len(t, output, 10)
	for _, round := range output {
		assert.NotNil(t, round.Round)
		assert.Nil(t, round.Investor)
	}

	assert.Equal(t, cursor, output[0].ID)
}

func TestGetRoundInvestmentsByPage(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(1),
		seed.WithRoundInvestments(55),
	)

	service, _ := util.SetupTestService(t, seedConfig, ctx)

	output, err := service.AccountService.GetRoundInvestmentsByPage(
		ctx,
		1,
		10,
		1,
	)
	assert.NoError(t, err)

	assert.Len(t, output, 11)
	for _, round := range output {
		assert.NotNil(t, round.Round)
		assert.Nil(t, round.Investor)
	}
	assert.Less(t, output[0].ID, output[1].ID)

	output, err = service.AccountService.GetRoundInvestmentsByPage(
		ctx,
		1,
		10,
		6,
	)

	assert.NoError(t, err)
	assert.Len(t, output, 5)
	for _, round := range output {
		assert.NotNil(t, round.Round)
		assert.Nil(t, round.Investor)
	}

	assert.Less(t, output[0].ID, output[1].ID)
}
