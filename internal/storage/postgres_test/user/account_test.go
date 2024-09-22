package user_test

import (
	"context"
	"testing"

	"fundlevel/internal/storage/postgres/user"
	"fundlevel/internal/storage/postgres_test/seed"
	"fundlevel/internal/storage/postgres_test/util"
	"github.com/stretchr/testify/assert"
)

func TestGetAccount(t *testing.T) {
	testCtx := context.Background()

	// Setup test database and seed data
	seedConfig := seed.NewSeedConfig(
		seed.WithNumUsers(12),
	)

	db, seedResult := util.SetupTestDB(t, seedConfig)

	// Create a new UserRepository instance
	userRepository := user.NewUserRepository(db, testCtx)

	// Use a user ID from the seeded data
	userId := seedResult.UserIds[0]

	// Call the GetAccount method
	account, err := userRepository.GetAccount(testCtx, userId)

	// Assert no error occurred
	assert.NoError(t, err)

	// Assert the account data is as expected
	assert.Equal(t, userId, account.UserID)
	// Add more assertions as needed to validate the account data
}
