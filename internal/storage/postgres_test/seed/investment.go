package seed

import (
	"database/sql"
	"fundlevel/internal/entities/investment"
	"math/rand"
)

type RoundInvestmentMap map[int][]investment.RoundInvestment

// SeedRegularDynamicRounds creates a single active rounds for a given list of venture ids that are
// expected to already exist in the database
func SeedRoundInvestments(db *sql.DB, roundIds []int, accountIds []int, seedConfig SeedConfig) (RoundInvestmentMap, error) {
	inactiveStatuses := []investment.InvestmentStatus{investment.InvestmentStatusPending, investment.InvestmentStatusAccepted, investment.InvestmentStatusRejected, investment.InvestmentStatusWithdrawn}
	roundInvestments := make(RoundInvestmentMap)

	for i := 0; i < seedConfig.numRoundInvestments; i++ {
		roundId := roundIds[i%len(roundIds)]
		accountId := accountIds[i%len(accountIds)]

		var status investment.InvestmentStatus
		if _, roundExists := roundInvestments[roundId]; !roundExists {
			status = investment.InvestmentStatusPending
		} else {
			status = investment.InvestmentStatus(inactiveStatuses[rand.Intn(len(inactiveStatuses))])
		}

		var invetmentId int
		err := db.QueryRow(
			`INSERT INTO round_investments (round_id, investor_id, amount, status)
			VALUES ($1, $2, $3, $4) RETURNING id;`,
			roundId,
			accountId,
			rand.Intn(1000000000)+1,
			status,
		).Scan(&invetmentId)
		if err != nil {
			return nil, err
		}

		investment := investment.RoundInvestment{
			CreateInvestmentParams: investment.CreateInvestmentParams{
				RoundID:    roundId,
				InvestorID: accountId,
				Amount:     rand.Intn(1000000000) + 1,
				Status:     status,
			},
		}
		investment.ID = invetmentId

		roundInvestments[roundId] = append(roundInvestments[roundId], investment)
	}

	return roundInvestments, nil
}
