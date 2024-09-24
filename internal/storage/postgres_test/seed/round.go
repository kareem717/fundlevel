package seed

import (
	"database/sql"
	"fundlevel/internal/entities/round"
	"math/rand"
	"time"
)

// SeedRounds creates a single active rounds for a given list of venture ids that are
// expected to already exist in the database
func SeedRounds(db *sql.DB, ventureIds []int) ([]int, error) {
	roundIds := make([]int, len(ventureIds))
	currencies := []round.Currency{round.USD, round.GBP, round.EUR, round.CAD, round.AUD, round.JPY}

	for i, ventureId := range ventureIds {
		roundId := i + 1
		roundIds[i] = roundId
		_, err := db.Exec(
			`INSERT INTO rounds (id, venture_id, begins_at, ends_at, percentage_offered, percentage_value, value_currency)
VALUES ($1, $2, $3, $4, $5, $6, $7)`,
			roundId,
			ventureId,
			time.Now().Add(time.Hour*24),
			time.Now().Add(time.Hour*24*time.Duration(rand.Intn(365))),
			rand.Float64()*100,
			rand.Intn(500000000),
			currencies[rand.Intn(len(currencies))], // Pick a random currency
		)
		if err != nil {
			return nil, err
		}
	}

	return roundIds, nil
}