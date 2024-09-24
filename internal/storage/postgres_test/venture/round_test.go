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

func TestGetRounds(t *testing.T) {
	testCtx := context.Background()

	// Setup test database and seed data
	seedConfig := seed.NewSeedConfig(
		seed.WithUsers(12),
		seed.WithVentures(10),
		seed.WithRounds(30),
	)

	db, seedResult := util.SetupTestDB(t, seedConfig)

	// Create a new UserRepository instance
	ventureRepository := venture.NewVentureRepository(db, testCtx)

	// Use a user ID from the seeded data
	ventureId := seedResult.VentureIds[0]

	// Call the GetAccount method
	rounds, err := ventureRepository.GetRounds(testCtx, ventureId, shared.PaginationRequest{})
	if err != nil {
		t.Fatalf("Error getting rounds: %v", err)
	}

	// Assert no error occurred
	assert.Len(t, rounds, 3)

	// Assert the account data is as expected
	for _, round := range rounds {
		assert.Equal(t, round.VentureID, ventureId)
		assert.Less(t, round.BeginsAt, round.EndsAt)
		assert.Less(t, round.CreatedAt, round.BeginsAt)

		assert.LessOrEqual(t, round.PercentageOffered, 100.0)
		assert.GreaterOrEqual(t, round.PercentageOffered, 0.0)
		assert.Nil(t, round.RegularDynamicRoundID)
	}
}
