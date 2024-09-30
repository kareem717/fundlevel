package venture_test

import (
	"context"
	"testing"

	"fundlevel/internal/storage/postgres/shared"
	"fundlevel/internal/storage/postgres/venture"
	"fundlevel/internal/storage/postgres_test/seed"
	"fundlevel/internal/storage/postgres_test/util"

	"github.com/stretchr/testify/assert"
)

func TestGetVentureRoundInvestmentsByCursor(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(1),
		seed.WithVentures(10),
		seed.WithRoundInvestments(100),
	)

	db, seedResults := util.SetupTestDB(t, seedConfig)

	repo := venture.NewVentureRepository(db, ctx)

	ventureId := seedResults.VentureIds[0]
	roundId := seedResults.VentureFixedTotalRounds[ventureId][0].RoundID
	investments := seedResults.RoundInvestments[roundId]

	params := shared.CursorPagination{
		Limit: len(investments)/2,
	}

	investments, err := repo.GetVentureRoundInvestmentsByCursor(ctx, ventureId, params)
	assert.NoError(t, err)

	assert.Len(t, investments, params.Limit)

	for _, investment := range investments {
		assert.NotNil(t, investment.Round)
		assert.NotNil(t, investment.Investor)
	}

	params.Cursor = investments[params.Limit-1].ID
	investments, err = repo.GetVentureRoundInvestmentsByCursor(ctx, ventureId, params)

	assert.NoError(t, err)
	assert.Len(t, investments, params.Limit)
	for _, investment := range investments {
		assert.NotNil(t, investment.Round)
		assert.NotNil(t, investment.Investor)
	}

	assert.Equal(t, investments[0].ID, params.Cursor)

}

func TestGetVentureRoundInvestmentsByPage(t *testing.T) {
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

	repo := venture.NewVentureRepository(db, ctx)

	ventureId := seedResults.VentureIds[0]
	roundId := seedResults.VentureFixedTotalRounds[ventureId][0].RoundID
	investments := seedResults.RoundInvestments[roundId]

	params := shared.OffsetPagination{
		Page:     1,
		PageSize: 5,
	}

	investments, err := repo.GetVentureRoundInvestmentsByPage(ctx, ventureId, params)
	assert.NoError(t, err)

	assert.Len(t, investments, params.PageSize+1)

	for _, investment := range investments {
		assert.NotNil(t, investment.Round)
		assert.NotNil(t, investment.Investor)
	}
	params.Page = 2

	investments, err = repo.GetVentureRoundInvestmentsByPage(ctx, ventureId, params)

	assert.NoError(t, err)
	assert.Len(t, investments, params.PageSize+1)
	for _, investment := range investments {
		assert.NotNil(t, investment.Round)
		assert.NotNil(t, investment.Investor)
	}

	params.Page = 12
	investments, err = repo.GetVentureRoundInvestmentsByPage(ctx, ventureId, params)

	assert.NoError(t, err)
	assert.Len(t, investments, params.PageSize)
	for _, investment := range investments {
		assert.NotNil(t, investment.Round)
		assert.NotNil(t, investment.Investor)
	}

	params.Page = 13
	investments, err = repo.GetVentureRoundInvestmentsByPage(ctx, ventureId, params)

	assert.NoError(t, err)
	assert.Len(t, investments, 0)
}
