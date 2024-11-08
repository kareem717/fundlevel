package seed

import (
	"database/sql"
	"fundlevel/internal/entities/round"
	"fundlevel/internal/entities/shared"
	"math/rand"
	"time"
)

type FixedTotalRound struct {
	RoundID int
	Status  round.RoundStatus
}

type FixedTotalRoundMap map[int][]FixedTotalRound

// SeedFixedTotalRounds creates a single active rounds for a given list of venture ids that are
// expected to already exist in the database
func SeedFixedTotalRounds(db *sql.DB, ventureIds []int, seedConfig SeedConfig) (FixedTotalRoundMap, error) {
	currencies := []shared.Currency{shared.USD, shared.GBP, shared.EUR, shared.CAD, shared.AUD, shared.JPY}
	inactiveStatuses := []round.RoundStatus{round.RoundStatusSuccessful, round.RoundStatusFailed}
	fixedTotalRounds := make(FixedTotalRoundMap)

	for i := 0; i < seedConfig.numFixedTotalRounds; i++ {
		ventureId := ventureIds[i%len(ventureIds)]

		beginsAt := time.Now().Add(time.Hour * 24)
		endsAt := beginsAt.Add(time.Hour * time.Duration(24+rand.Intn(365*24)))
		percentageOffered := rand.Float64() * 100
		percentageValue := rand.Intn(500000000)
		valueCurrency := currencies[rand.Intn(len(currencies))]

		var status round.RoundStatus
		if _, roundExists := fixedTotalRounds[ventureId]; !roundExists {
			status = round.RoundStatusActive
		} else {
			status = inactiveStatuses[rand.Intn(len(inactiveStatuses))]
		}

		tx, err := db.Begin()
		if err != nil {
			return nil, err
		}

		var roundId int
		err = tx.QueryRow(
			`INSERT INTO rounds (venture_id, begins_at, ends_at, percentage_offered, percentage_value, value_currency, status)
			VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;`,
			ventureId,
			beginsAt,
			endsAt,
			percentageOffered,
			percentageValue,
			valueCurrency,
			status,
		).Scan(&roundId)
		if err != nil {
			tx.Rollback()
			return nil, err
		}

		fixedTotalRounds[ventureId] = append(fixedTotalRounds[ventureId], FixedTotalRound{
			RoundID: roundId,
			Status:  status,
		})

		_, err = tx.Exec(
			`INSERT INTO fixed_total_rounds (round_id) VALUES ($1);`,
			roundId,
		)
		if err != nil {
			tx.Rollback()
			return nil, err
		}

		err = tx.Commit()
		if err != nil {
			return nil, err
		}
	}

	return fixedTotalRounds, nil
}

type RegularDynamicRound struct {
	RoundID int
	Status  round.RoundStatus
}

type RegularDynamicRoundMap map[int][]RegularDynamicRound

// SeedRegularDynamicRounds creates a single active rounds for a given list of venture ids that are
// expected to already exist in the database
func SeedRegularDynamicRounds(db *sql.DB, ventureIds []int, seedConfig SeedConfig) (RegularDynamicRoundMap, error) {
	currencies := []shared.Currency{shared.USD, shared.GBP, shared.EUR, shared.CAD, shared.AUD, shared.JPY}
	inactiveStatuses := []round.RoundStatus{round.RoundStatusSuccessful, round.RoundStatusFailed}
	regularDynamicRounds := make(RegularDynamicRoundMap)

	for i := seedConfig.numFixedTotalRounds; i < seedConfig.numFixedTotalRounds+seedConfig.numRegularDynamicRounds; i++ {
		ventureId := ventureIds[i%len(ventureIds)]

		beginsAt := time.Now().Add(time.Hour * 24)
		endsAt := beginsAt.Add(time.Hour * time.Duration(24+rand.Intn(365*24)))
		percentageOffered := rand.Float64() * 100
		percentageValue := rand.Intn(500000000)
		valueCurrency := currencies[rand.Intn(len(currencies))]

		var status round.RoundStatus
		if _, roundExists := regularDynamicRounds[ventureId]; !roundExists {
			status = round.RoundStatusActive
		} else {
			status = inactiveStatuses[rand.Intn(len(inactiveStatuses))]
		}

		tx, err := db.Begin()
		if err != nil {
			return nil, err
		}

		var roundId int
		err = tx.QueryRow(
			`INSERT INTO rounds (venture_id, begins_at, ends_at, percentage_offered, percentage_value, value_currency, status)
			VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;`,
			ventureId,
			beginsAt,
			endsAt,
			percentageOffered,
			percentageValue,
			valueCurrency,
			status,
		).Scan(&roundId)
		if err != nil {
			tx.Rollback()
			return nil, err
		}

		regularDynamicRounds[ventureId] = append(regularDynamicRounds[ventureId], RegularDynamicRound{
			RoundID: roundId,
			Status:  status,
		})

		_, err = tx.Exec(
			`INSERT INTO regular_dynamic_rounds (round_id, days_extend_on_bid) VALUES ($1, $2);`,
			roundId,
			rand.Intn(30)+1,
		)
		if err != nil {
			tx.Rollback()
			return nil, err
		}

		err = tx.Commit()
		if err != nil {
			return nil, err
		}
	}

	return regularDynamicRounds, nil
}

type PartialTotalRound struct {
	RoundID int
	Status  round.RoundStatus
}

type PartialTotalRoundMap map[int][]PartialTotalRound

// SeedRegularDynamicRounds creates a single active rounds for a given list of venture ids that are
// expected to already exist in the database
func SeedPartialTotalRounds(db *sql.DB, ventureIds []int, seedConfig SeedConfig) (PartialTotalRoundMap, error) {
	currencies := []shared.Currency{shared.USD, shared.GBP, shared.EUR, shared.CAD, shared.AUD, shared.JPY}
	inactiveStatuses := []round.RoundStatus{round.RoundStatusSuccessful, round.RoundStatusFailed}
	partialTotalRounds := make(PartialTotalRoundMap)

	for i := seedConfig.numFixedTotalRounds + seedConfig.numRegularDynamicRounds; i < seedConfig.numFixedTotalRounds+seedConfig.numRegularDynamicRounds+seedConfig.numPartialTotalRounds; i++ {
		ventureId := ventureIds[i%len(ventureIds)]

		beginsAt := time.Now().Add(time.Hour * 24)
		endsAt := beginsAt.Add(time.Hour * time.Duration(24+rand.Intn(365*24)))
		percentageOffered := rand.Float64() * 100
		percentageValue := rand.Intn(500000000)
		valueCurrency := currencies[rand.Intn(len(currencies))]

		var status round.RoundStatus
		if _, roundExists := partialTotalRounds[ventureId]; !roundExists {
			status = round.RoundStatusActive
		} else {
			status = inactiveStatuses[rand.Intn(len(inactiveStatuses))]
		}

		tx, err := db.Begin()
		if err != nil {
			return nil, err
		}

		var roundId int
		err = tx.QueryRow(
			`INSERT INTO rounds (venture_id, begins_at, ends_at, percentage_offered, percentage_value, value_currency, status)
			VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;`,
			ventureId,
			beginsAt,
			endsAt,
			percentageOffered,
			percentageValue,
			valueCurrency,
			status,
		).Scan(&roundId)
		if err != nil {
			tx.Rollback()
			return nil, err
		}

		partialTotalRounds[ventureId] = append(partialTotalRounds[ventureId], PartialTotalRound{
			RoundID: roundId,
			Status:  status,
		})

		_, err = tx.Exec(
			`INSERT INTO partial_total_rounds (round_id, investor_count) VALUES ($1, $2);`,
			roundId,
			rand.Intn(10)+1,
		)
		if err != nil {
			tx.Rollback()
			return nil, err
		}

		err = tx.Commit()
		if err != nil {
			return nil, err
		}
	}

	return partialTotalRounds, nil
}

type DutchDynamicRound struct {
	RoundID int
	Status  round.RoundStatus
}

type DutchDynamicRoundMap map[int][]DutchDynamicRound

// SeedRegularDynamicRounds creates a single active rounds for a given list of venture ids that are
// expected to already exist in the database
func SeedDutchDynamicRounds(db *sql.DB, ventureIds []int, seedConfig SeedConfig) (DutchDynamicRoundMap, error) {
	currencies := []shared.Currency{shared.USD, shared.GBP, shared.EUR, shared.CAD, shared.AUD, shared.JPY}
	inactiveStatuses := []round.RoundStatus{round.RoundStatusSuccessful, round.RoundStatusFailed}
	dutchDynamicRounds := make(DutchDynamicRoundMap)

	for i := seedConfig.numFixedTotalRounds + seedConfig.numRegularDynamicRounds + seedConfig.numPartialTotalRounds; i < seedConfig.numFixedTotalRounds+seedConfig.numRegularDynamicRounds+seedConfig.numPartialTotalRounds+seedConfig.numDutchDynamicRounds; i++ {
		ventureId := ventureIds[i%len(ventureIds)]

		beginsAt := time.Now().Add(time.Hour * 24)
		endsAt := beginsAt.Add(time.Hour * time.Duration(24+rand.Intn(365*24)))
		percentageOffered := rand.Float64() * 100
		percentageValue := rand.Intn(500000000)
		valueCurrency := currencies[rand.Intn(len(currencies))]

		var status round.RoundStatus
		if _, roundExists := dutchDynamicRounds[ventureId]; !roundExists {
			status = round.RoundStatusActive
		} else {
			status = inactiveStatuses[rand.Intn(len(inactiveStatuses))]
		}

		tx, err := db.Begin()
		if err != nil {
			return nil, err
		}

		var roundId int
		err = tx.QueryRow(
			`INSERT INTO rounds (venture_id, begins_at, ends_at, percentage_offered, percentage_value, value_currency, status)
			VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;`,
			ventureId,
			beginsAt,
			endsAt,
			percentageOffered,
			percentageValue,
			valueCurrency,
			status,
		).Scan(&roundId)
		if err != nil {
			tx.Rollback()
			return nil, err
		}

		dutchDynamicRounds[ventureId] = append(dutchDynamicRounds[ventureId], DutchDynamicRound{
			RoundID: roundId,
			Status:  status,
		})

		_, err = tx.Exec(
			`INSERT INTO dutch_dynamic_rounds (round_id, valuation_dollar_drop_rate, valuation_stop_loss, valuation_drop_interval_days) VALUES ($1, $2, $3, $4);`,
			roundId,
			rand.Intn(10)+1,
			rand.Intn(1000000000)+1,
			rand.Intn(10)+1,
		)
		if err != nil {
			tx.Rollback()
			return nil, err
		}

		err = tx.Commit()
		if err != nil {
			return nil, err
		}
	}

	return dutchDynamicRounds, nil
}

