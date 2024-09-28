package round_test

import (
	"context"
	"testing"

	"fundlevel/internal/storage/postgres/round"
	"fundlevel/internal/storage/postgres/shared"
	"fundlevel/internal/storage/postgres_test/seed"
	"fundlevel/internal/storage/postgres_test/util"

	"github.com/stretchr/testify/assert"
)

func TestGetRoundInvestmentsByCursor(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(1),
		seed.WithVentures(10),
		seed.WithRoundInvestments(100),
	)

	db, seedResults := util.SetupTestDB(t, seedConfig)

	repo := round.NewRoundRepository(db, ctx)

	ventureId := seedResults.VentureIds[0]
	roundId := seedResults.VentureFixedTotalRounds[ventureId][0].RoundID
	investments := seedResults.RoundInvestments[roundId]

	params := shared.CursorPagination{
		Limit: len(investments)/2,
	}

	investments, err := repo.GetRoundInvestmentsByCursor(ctx, roundId, params)
	assert.NoError(t, err)

	assert.Len(t, investments, params.Limit)

	for _, investment := range investments {
		assert.Nil(t, investment.Round)
		assert.NotNil(t, investment.Investor)
	}

	params.Cursor = investments[params.Limit-1].ID
	investments, err = repo.GetRoundInvestmentsByCursor(ctx, roundId, params)

	assert.NoError(t, err)
	assert.Len(t, investments, params.Limit)
	for _, investment := range investments {
		assert.Nil(t, investment.Round)
		assert.NotNil(t, investment.Investor)
	}

	assert.Equal(t, investments[0].ID, params.Cursor)

}

func TestGetRoundInvestmentsByPage(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(1),
		seed.WithVentures(1),
		seed.WithDutchDynamicRounds(1),
		seed.WithFixedTotalRounds(1),
		seed.WithPartialTotalRounds(1),
		seed.WithRegularDynamicRounds(1),
		seed.WithRoundInvestments(60),
	)

	db, seedResults := util.SetupTestDB(t, seedConfig)

	repo := round.NewRoundRepository(db, ctx)

	ventureId := seedResults.VentureIds[0]
	roundId := seedResults.VentureFixedTotalRounds[ventureId][0].RoundID
	investments := seedResults.RoundInvestments[roundId]

	params := shared.OffsetPagination{
		Page:     1,
		PageSize: 5,
	}

	investments, err := repo.GetRoundInvestmentsByPage(ctx, roundId, params)
	assert.NoError(t, err)

	assert.Len(t, investments, params.PageSize+1)

	for _, investment := range investments {
		assert.Nil(t, investment.Round)
		assert.NotNil(t, investment.Investor)
	}
	params.Page = 2

	investments, err = repo.GetRoundInvestmentsByPage(ctx, roundId, params)

	assert.NoError(t, err)
	assert.Len(t, investments, params.PageSize+1)
	for _, investment := range investments {
		assert.Nil(t, investment.Round)
		assert.NotNil(t, investment.Investor)
	}

	params.Page = 3
	investments, err = repo.GetRoundInvestmentsByPage(ctx, roundId, params)

	assert.NoError(t, err)
	assert.Len(t, investments, params.PageSize)
	for _, investment := range investments {
		assert.Nil(t, investment.Round)
		assert.NotNil(t, investment.Investor)
	}

	params.Page = 4
	investments, err = repo.GetRoundInvestmentsByPage(ctx, roundId, params)

	assert.NoError(t, err)
	assert.Len(t, investments, 0)
}
