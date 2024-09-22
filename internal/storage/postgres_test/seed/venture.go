package seed

import (
	"database/sql"

	"github.com/go-faker/faker/v4"
)

// SeedVentures creates ventures for a given list of account ids that are
// expected to already exist in the database.
func SeedVentures(db *sql.DB, accountIds []int, numVentures int) ([]int, error) {
	ventureIds := make([]int, numVentures)

	for i := 0; i < numVentures; i++ {
		ventureId := i + 1
		accountId := accountIds[i%len(accountIds)]
		ventureIds[i] = ventureId
		_, err := db.Exec(
			`INSERT INTO ventures (id, owner_account_id, name, description)
VALUES ($1, $2, $3, $4)`,
			ventureId,
			accountId,
			faker.Name(),
			faker.Paragraph(),
		)
		if err != nil {
			return nil, err
		}
	}

	return ventureIds, nil
}
