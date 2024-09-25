package seed

import (
	"database/sql"

	"github.com/google/uuid"
)

// SeedConfig is used to configure what data is seeded into the
// mock postgres database.
type SeedConfig struct {
	numUsers            int
	numVentures         int
	numFixedTotalRounds int
}

// SeedConfigOption is a option function that alters the SeedConfig
type SeedConfigOption func(config *SeedConfig)

// NewSeedConfig creates a new SeedConfig utilizing the provided options
// or default values for any unspecified options.
func NewSeedConfig(opts ...SeedConfigOption) SeedConfig {
	config := SeedConfig{
		numUsers:            10,
		numVentures:         50,
		numFixedTotalRounds: 10,
	}

	for _, opt := range opts {
		opt(&config)
	}

	return config
}

// WithNumUsers sets the number of users to seed. Each user will have
// an account created for them.
func WithUsers(numUsers int) SeedConfigOption {
	return func(config *SeedConfig) {
		config.numUsers = numUsers
	}
}

// WithNumVentures sets the number of ventures to seed.
func WithVentures(numVentures int) SeedConfigOption {
	return func(config *SeedConfig) {
		config.numVentures = numVentures
	}
}

// WithRounds sets the number of rounds to seed. If the number is greater than
// the number of ventures, each venture will have a single active round and
// the remaining rounds will be inactive.
func WithFixedTotalRounds(numFixedTotalRounds int) SeedConfigOption {
	return func(config *SeedConfig) {
		config.numFixedTotalRounds = numFixedTotalRounds
	}
}

// SeedResult is the result of seeding the database. It contains useful
// information about the seeded data.
type SeedResult struct {
	// UserIds is a list of the ids of the users that were seeded.
	UserIds []uuid.UUID
	// AccountIds is a list of the ids of the accounts that were seeded.
	AccountIds []int
	// VentureIds is a list of the ids of the ventures that were seeded.
	VentureIds []int
	// FixedTotalRounds is a map of the ids of the ventures to the ids of the fixed total rounds that were seeded.
	VentureFixedTotalRounds FixedTotalRoundMap
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

	ventureIds, err := SeedVentures(db, accountIds, config.numVentures)
	if err != nil {
		return nil, err
	}

	result.VentureIds = ventureIds

	fixedTotalRounds, err := SeedFixedTotalRounds(db, ventureIds, config.numFixedTotalRounds)
	if err != nil {
		return nil, err
	}

	result.VentureFixedTotalRounds = fixedTotalRounds
	return &result, nil
}
