package round_test

import (
	"context"
	"testing"

	"fundlevel/internal/storage/postgres/account"
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
		seed.WithRoundInvestments(30),
	)

	db, seedResults := util.SetupTestDB(t, seedConfig)

	repo := account.NewAccountRepository(db, ctx)

	params := shared.CursorPagination{
		Limit: 21,
	}

	accountId := seedResults.AccountIds[0]

	investments, err := repo.GetRoundInvestmentsByCursor(ctx, accountId, params)
	assert.NoError(t, err)

	assert.Len(t, investments, 21)

	for _, investment := range investments {
		assert.NotNil(t, investment.Round)
		assert.Nil(t, investment.Investor)
	}

	params.Cursor = investments[params.Limit-1].ID
	investments, err = repo.GetRoundInvestmentsByCursor(ctx, accountId, params)

	assert.NoError(t, err)
	assert.Len(t, investments, 10)
	for _, investment := range investments {
		assert.NotNil(t, investment.Round)
		assert.Nil(t, investment.Investor)
	}

	assert.Equal(t, investments[0].ID, params.Cursor)

}

func TestGetRoundInvestmentsByPage(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(1),
		seed.WithVentures(1),
		seed.WithRoundInvestments(100),
	)

	db, seedResults := util.SetupTestDB(t, seedConfig)

	repo := account.NewAccountRepository(db, ctx)

	accountId := seedResults.AccountIds[0]

	params := shared.OffsetPagination{
		Page:     1,
		PageSize: 20,
	}

	investments, err := repo.GetRoundInvestmentsByPage(ctx, accountId, params)
	assert.NoError(t, err)

	assert.Len(t, investments, 21)

	for _, investment := range investments {
		assert.NotNil(t, investment.Round)
		assert.Nil(t, investment.Investor)
	}
	params.Page = 2

	investments, err = repo.GetRoundInvestmentsByPage(ctx, accountId, params)

	assert.NoError(t, err)
	assert.Len(t, investments, 21)
	for _, investment := range investments {
		assert.NotNil(t, investment.Round)
		assert.Nil(t, investment.Investor)
	}

	params.Page = 5

	investments, err = repo.GetRoundInvestmentsByPage(ctx, accountId, params)

	assert.NoError(t, err)
	assert.Len(t, investments, 20)
	for _, investment := range investments {
		assert.NotNil(t, investment.Round)
		assert.Nil(t, investment.Investor)
	}
}

func TestIsInvestedInRound(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(1),
		seed.WithVentures(1),
		seed.WithRoundInvestments(40),
	)

	db, seedResults := util.SetupTestDB(t, seedConfig)

	repo := account.NewAccountRepository(db, ctx)

	accountId := seedResults.AccountIds[0]
	ventureId := seedResults.VentureIds[0]
	roundId := seedResults.VentureFixedTotalRounds[ventureId][0].RoundID

	exists, err := repo.IsInvestedInRound(ctx, accountId, roundId)
	assert.NoError(t, err)
	assert.True(t, exists)
}
