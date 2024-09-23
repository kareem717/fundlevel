package seed

import (
	"database/sql"
	"fundlevel/internal/entities/round"
	"math/rand/v2"
	"time"
)

// SeedRounds creates a single active rounds for a given list of venture ids that are
// expected to already exist in the database
func SeedRounds(db *sql.DB, ventureIds []int) ([]int, error) {
	roundIds := make([]int, len(ventureIds))

	for i, ventureId := range ventureIds {
		roundId := i + 1
		roundIds[i] = roundId
		_, err := db.Exec(
			`INSERT INTO rounds (id, venture_id, offered_percentage, monetary_percentage_value, monetary_value_currency, begins_at)
VALUES ($1, $2, $3, $4, $5, $6)`,
			roundId,
			ventureId,
			rand.Float64()*100,
			rand.IntN(10000000),
			round.USD,
			time.Now().Add(time.Hour*24),
		)
		if err != nil {
			return nil, err
		}
	}

	return roundIds, nil
}

func SeedDynamicRounds(db *sql.DB, roundIds []int) ([]int, error) {
	dynamicRoundIds := make([]int, len(roundIds))

	for i, roundId := range roundIds {
		dynamicRoundId := i + 1
		dynamicRoundIds[i] = dynamicRoundId
		_, err := db.Exec(
			`INSERT INTO dynamic_rounds (id, round_id, minimum_monetary_investment_value, ends_at)
VALUES ($1, $2, $3, $4)`,
			dynamicRoundId,
			roundId,
			rand.IntN(10000000),
			time.Now().Add(time.Hour*24*30),
		)
		if err != nil {
			return nil, err
		}
	}

	return dynamicRoundIds, nil
}

func SeedStaticRounds(db *sql.DB, roundIds []int) ([]int, error) {
	staticRoundIds := make([]int, len(roundIds))

	for i, roundId := range roundIds {
		staticRoundId := i + 1
		staticRoundIds[i] = staticRoundId
		_, err := db.Exec(
			`INSERT INTO static_rounds (id, round_id, ends_at)
VALUES ($1, $2, $3)`,
			staticRoundId,
			roundId,
			time.Now().Add(time.Hour*24*30),
		)
		if err != nil {
			return nil, err
		}
	}

	return staticRoundIds, nil
}
