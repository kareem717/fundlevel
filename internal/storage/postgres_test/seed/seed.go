package seed

import (
	"database/sql"

	"github.com/google/uuid"
)

// SeedConfig is used to configure what data is seeded into the
// mock postgres database.
type SeedConfig struct {
	numUsers                int
	numVentures             int
	numFixedTotalRounds     int
	numRegularDynamicRounds int
	numPartialTotalRounds   int
	numDutchDynamicRounds   int
	numRoundInvestments     int
}

// SeedConfigOption is a option function that alters the SeedConfig
type SeedConfigOption func(config *SeedConfig)

// NewSeedConfig creates a new SeedConfig utilizing the provided options
// or default values for any unspecified options.
func NewSeedConfig(opts ...SeedConfigOption) SeedConfig {
	config := SeedConfig{
		numUsers:                10,
		numVentures:             50,
		numFixedTotalRounds:     10,
		numRegularDynamicRounds: 10,
		numPartialTotalRounds:   10,
		numDutchDynamicRounds:   10,
		numRoundInvestments:     10,
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

// WithPartialTotalRounds sets the number of partial total rounds to seed.
func WithPartialTotalRounds(numPartialTotalRounds int) SeedConfigOption {
	return func(config *SeedConfig) {
		config.numPartialTotalRounds = numPartialTotalRounds
	}
}

// WithRegularDynamicRounds sets the number of regular dynamic rounds to seed.
func WithRegularDynamicRounds(numRegularDynamicRounds int) SeedConfigOption {
	return func(config *SeedConfig) {
		config.numRegularDynamicRounds = numRegularDynamicRounds
	}
}

// WithDutchDynamicRounds sets the number of dutch dynamic rounds to seed.
func WithDutchDynamicRounds(numDutchDynamicRounds int) SeedConfigOption {
	return func(config *SeedConfig) {
		config.numDutchDynamicRounds = numDutchDynamicRounds
	}
}

// WithRoundInvestments sets the number of round investments to seed.
func WithRoundInvestments(numRoundInvestments int) SeedConfigOption {
	return func(config *SeedConfig) {
		config.numRoundInvestments = numRoundInvestments
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
	// VentureRegularDynamicRounds is a map of the ids of the ventures to the ids of the regular dynamic rounds that were seeded.
	VentureRegularDynamicRounds RegularDynamicRoundMap
	// VenturePartialTotalRounds is a map of the ids of the ventures to the ids of the partial total rounds that were seeded.
	VenturePartialTotalRounds PartialTotalRoundMap
	// VentureDutchDynamicRounds is a map of the ids of the ventures to the ids of the dutch dynamic rounds that were seeded.
	VentureDutchDynamicRounds DutchDynamicRoundMap
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

	fixedTotalRounds, err := SeedFixedTotalRounds(db, ventureIds, config)
	if err != nil {
		return nil, err
	}

	result.VentureFixedTotalRounds = fixedTotalRounds

	regularDynamicRounds, err := SeedRegularDynamicRounds(db, ventureIds, config)
	if err != nil {
		return nil, err
	}

	result.VentureRegularDynamicRounds = regularDynamicRounds

	partialTotalRounds, err := SeedPartialTotalRounds(db, ventureIds, config)
	if err != nil {
		return nil, err
	}

	result.VenturePartialTotalRounds = partialTotalRounds

	dutchDynamicRounds, err := SeedDutchDynamicRounds(db, ventureIds, config)
	if err != nil {
		return nil, err
	}

	result.VentureDutchDynamicRounds = dutchDynamicRounds

	//TODO: cleanup
	var roundIds []int
	for _, rounds := range result.VentureFixedTotalRounds {
		for _, round := range rounds {
			roundIds = append(roundIds, round.RoundID)
		}
	}
	for _, rounds := range result.VentureRegularDynamicRounds {
		for _, round := range rounds {
			roundIds = append(roundIds, round.RoundID)
		}
	}
	for _, rounds := range result.VenturePartialTotalRounds {
		for _, round := range rounds {
			roundIds = append(roundIds, round.RoundID)
		}
	}
	for _, rounds := range result.VentureDutchDynamicRounds {
		for _, round := range rounds {
			roundIds = append(roundIds, round.RoundID)
		}
	}

	return &result, nil
}
