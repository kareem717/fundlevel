package seed

import (
	"database/sql"
	"fundlevel/internal/entities/round"
	"math/rand"
	"time"
)

type VentureRound struct {
	RoundID   int
	Status    round.RoundStatus
}

type VentureRoundMap map[int][]VentureRound

// SeedRounds creates a single active rounds for a given list of venture ids that are
// expected to already exist in the database
func SeedRounds(db *sql.DB, ventureIds []int, numRounds int) (VentureRoundMap, error) {
	currencies := []round.Currency{round.USD, round.GBP, round.EUR, round.CAD, round.AUD, round.JPY}
	inactiveStatuses := []round.RoundStatus{round.Successful, round.Failed}
	ventureRounds := make(VentureRoundMap)

	for i := 0; i < numRounds; i++ {
		roundId := i + 1
		ventureId := ventureIds[i%len(ventureIds)]

		beginsAt := time.Now().Add(time.Hour * 24)
		endsAt := beginsAt.Add(time.Hour * time.Duration(24+rand.Intn(365*24)))
		percentageOffered := rand.Float64() * 100
		percentageValue := rand.Intn(500000000)
		valueCurrency := currencies[rand.Intn(len(currencies))]

		var status round.RoundStatus
		if _, roundExists := ventureRounds[ventureId]; !roundExists {
			status = round.Active
		} else {
			status = inactiveStatuses[rand.Intn(len(inactiveStatuses))]
		}

		ventureRounds[ventureId] = append(ventureRounds[ventureId], VentureRound{
			RoundID:   roundId,
			Status:    status,
		})

		_, err := db.Exec(
			`INSERT INTO rounds (id, venture_id, begins_at, ends_at, percentage_offered, percentage_value, value_currency, status)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
			roundId,
			ventureId,
			beginsAt,
			endsAt,
			percentageOffered,
			percentageValue,
			valueCurrency,
			status,
		)
		if err != nil {
			return nil, err
		}
	}

	return ventureRounds, nil
}
