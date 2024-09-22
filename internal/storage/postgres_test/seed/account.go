package seed

import (
	"database/sql"

	"github.com/go-faker/faker/v4"
	"github.com/google/uuid"
)

// SeedAccounts creates accounts for a given list of user ids that are
// expected to already exist in the database.
func SeedAccounts(db *sql.DB, userIds []uuid.UUID) ([]int, error) {
	accountIds := make([]int, len(userIds))

	for i, userId := range userIds {
		accountId := i + 1
		accountIds[i] = accountId
		_, err := db.Exec(
			`INSERT INTO accounts (id, first_name, last_name, user_id) VALUES ($1, $2, $3, $4)`,
			accountId,
			faker.FirstName(),
			faker.LastName(),
			userId,
		)
		if err != nil {
			return nil, err
		}
	}

	return accountIds, nil
}
