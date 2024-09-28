package round_test

import (
	"context"
	"testing"

	"fundlevel/internal/entities/investment"
	repo "fundlevel/internal/storage/postgres/investment"
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
		seed.WithRegularDynamicRounds(100),
	)

	db, seedResult := util.SetupTestDB(t, seedConfig)

	repo := repo.NewInvestmentRepository(db, ctx)

	ventureId := seedResult.VentureIds[0]
	dynamicRound := seedResult.VentureRegularDynamicRounds[ventureId][0]

	params := investment.CreateInvestmentParams{
		RoundID:    dynamicRound.RoundID,
		InvestorID: seedResult.AccountIds[0],
		Amount:     10000,
		Status:     investment.InvestmentStatusPending,
	}

	createdRound, err := repo.Create(ctx, params)

	assert.NoError(t, err)

	assert.Equal(t, createdRound.RoundID, params.RoundID)
	assert.Equal(t, createdRound.InvestorID, params.InvestorID)
	assert.Equal(t, createdRound.Amount, params.Amount)
	assert.Equal(t, createdRound.Status, params.Status)
	assert.NotEmpty(t, createdRound.ID)
}

func TestGetById(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(12),
		seed.WithVentures(10),
		seed.WithRoundInvestments(100),
	)

	db, seedResult := util.SetupTestDB(t, seedConfig)

	repo := repo.NewInvestmentRepository(db, ctx)

	roundId := 1
	investment := seedResult.RoundInvestments[roundId][0]

	round, err := repo.GetById(ctx, investment.ID)

	assert.NoError(t, err)

	assert.Equal(t, roundId, round.RoundID)
	assert.NotNilf(t, round.Investor, "Investor should not be nil")
	assert.NotNilf(t, round.Round, "Round should not be nil")
}

func TestGetByCursor(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(12),
		seed.WithVentures(10),
		seed.WithRoundInvestments(30),
	)

	db, _ := util.SetupTestDB(t, seedConfig)

	repo := repo.NewInvestmentRepository(db, ctx)

	params := shared.CursorPagination{
		Limit: 21,
	}

	investments, err := repo.GetByCursor(ctx, params)
	assert.NoError(t, err)

	assert.Len(t, investments, 21)

	for _, investment := range investments {
		assert.NotNil(t, investment.Round)
		assert.NotNil(t, investment.Investor)
	}

	params.Cursor = investments[params.Limit-1].ID
	investments, err = repo.GetByCursor(ctx, params)

	assert.NoError(t, err)
	assert.Len(t, investments, 10)
	for _, investment := range investments {
		assert.NotNil(t, investment.Round)
		assert.NotNil(t, investment.Investor)
	}

	assert.Equal(t, investments[0].ID, params.Cursor)

}

func TestGetByPage(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(12),
		seed.WithVentures(1),
		seed.WithRoundInvestments(100),
	)

	db, _ := util.SetupTestDB(t, seedConfig)

	repo := repo.NewInvestmentRepository(db, ctx)

	params := shared.OffsetPagination{
		Page:     1,
		PageSize: 20,
	}

	investments, err := repo.GetByPage(ctx, params)
	assert.NoError(t, err)

	assert.Len(t, investments, 21)

	for _, investment := range investments {
		assert.NotNil(t, investment.Round)
		assert.NotNil(t, investment.Investor)
	}
	params.Page = 2

	investments, err = repo.GetByPage(ctx, params)

	assert.NoError(t, err)
	assert.Len(t, investments, 21)
	for _, investment := range investments {
		assert.NotNil(t, investment.Round)
		assert.NotNil(t, investment.Investor)
	}

	params.Page = 5

	investments, err = repo.GetByPage(ctx, params)

	assert.NoError(t, err)
	assert.Len(t, investments, 20)
	for _, investment := range investments {
		assert.NotNil(t, investment.Round)
		assert.NotNil(t, investment.Investor)
	}
}
