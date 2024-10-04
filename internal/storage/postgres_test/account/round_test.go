package round_test

import (
	"context"
	"testing"

	"fundlevel/internal/entities/round"
	"fundlevel/internal/storage/postgres/account"
	"fundlevel/internal/storage/postgres/shared"
	"fundlevel/internal/storage/postgres_test/seed"
	"fundlevel/internal/storage/postgres_test/util"

	"github.com/stretchr/testify/assert"
)

func TestGetRoundsByFilterAndCursor(t *testing.T) {
	ctx := context.Background()

	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(1),
		seed.WithVentures(10),
		seed.WithDutchDynamicRounds(10),
		seed.WithFixedTotalRounds(10),
		seed.WithPartialTotalRounds(10),
		seed.WithRegularDynamicRounds(10),
	)

	db, seedResults := util.SetupTestDB(t, seedConfig)

	repo := account.NewAccountRepository(db, ctx)

	params := shared.CursorPagination{
		Limit: 21,
	}

	accountId := seedResults.AccountIds[0]

	investments, err := repo.GetRoundsByFilterAndCursor(ctx, accountId, round.RoundFilter{
		Status: []string{string(round.Active), string(round.Successful)},
	}, params)
	assert.NoError(t, err)

	assert.Len(t, investments, 21)

	for _, investment := range investments {
		assert.Contains(t, []round.RoundStatus{round.Active, round.Successful}, investment.Round.Status)
	}

	params.Cursor = investments[params.Limit-1].Round.ID
	investments, err = repo.GetRoundsByFilterAndCursor(ctx, accountId, round.RoundFilter{
		Status: []string{string(round.Active), string(round.Successful)},
	}, params)

	assert.NoError(t, err)
	assert.Len(t, investments, 20)
	for _, investment := range investments {
		assert.Contains(t, []round.RoundStatus{round.Active, round.Successful}, investment.Round.Status)
	}

	assert.Equal(t, investments[0].Round.ID, params.Cursor)
}
