package seed

import (
	"database/sql"

	"github.com/google/uuid"
)

// SeedConfig is used to configure what data is seeded into the
// mock postgres database.
type SeedConfig struct {
	numUsers int
}

// SeedConfigOption is a option function that alters the SeedConfig
type SeedConfigOption func(config *SeedConfig)

// NewSeedConfig creates a new SeedConfig utilizing the provided options
// or default values for any unspecified options.
func NewSeedConfig(opts ...SeedConfigOption) SeedConfig {
	config := SeedConfig{
		numUsers: 10,
	}

	for _, opt := range opts {
		opt(&config)
	}

	return config
}

// WithNumUsers sets the number of users to seed. Each user will have
// an account created for them.
func WithNumUsers(numUsers int) SeedConfigOption {
	return func(config *SeedConfig) {
		config.numUsers = numUsers
	}
}

// SeedResult is the result of seeding the database. It contains useful
// information about the seeded data.
type SeedResult struct {
	// UserIds is a list of the ids of the users that were seeded.
	UserIds []uuid.UUID
	// AccountIds is a list of the ids of the accounts that were seeded.
	AccountIds []int
}

// SeedDB seeds the database utilizing the configuration provided.
func SeedDB(db *sql.DB, config SeedConfig) (*SeedResult, error) {
	result := SeedResult{}

	userIds, err := SeedUsers(db, config.numUsers)
	if err != nil {
		return nil, err
	}

	result.UserIds = userIds

	accountIds, err := SeedAccounts(db, userIds)
	if err != nil {
		return nil, err
	}

	result.AccountIds = accountIds

	return &result, nil
}
