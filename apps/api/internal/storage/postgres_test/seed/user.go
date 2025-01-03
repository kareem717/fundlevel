package seed

import (
	"database/sql"

	"github.com/google/uuid"
)

// SeedUsers creates a given number of users in the `auth.users` table
// and returns their ids.
func SeedUsers(db *sql.DB, count int) ([]uuid.UUID, error) {
	userIds := make([]uuid.UUID, count)

	for i := 0; i < count; i++ {
		userId := uuid.New()
		userIds[i] = userId
	}

	for _, userId := range userIds {
		_, err := db.Exec(`INSERT INTO auth.users (id) VALUES ($1)`, userId)
		if err != nil {
			return nil, err
		}
	}

	return userIds, nil
}
