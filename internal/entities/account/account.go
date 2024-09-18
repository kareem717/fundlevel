package account

import (
	"fundlevel/internal/entities/shared"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type FirstName struct {
	FirstName string `json:"firstName" minLength:"3" maxLength:"30" pattern:"^[a-zA-Z]+$" patternDescription:"Must be a alphabetical string with at least 3 characters"`
}

type LastName struct {
	LastName string `json:"lastName" minLength:"3" maxLength:"30" pattern:"^[a-zA-Z]+$" patternDescription:"Must be a alphabetical string with at least 3 characters"`
}

// Account represents an account entity.
type Account struct {
	bun.BaseModel `bun:"table:accounts"`

	ID     int       `json:"id"`
	UserID uuid.UUID `json:"userId" format:"uuid" minLength:"36" maxLength:"36"`
	FirstName
	LastName
	shared.Timestamps
}

// CreateAccountParams contains the parameters for creating a new account.
type CreateAccountParams struct {
	FirstName
	LastName
	UserID uuid.UUID `json:"userId" format:"uuid" minLength:"36" maxLength:"36"`
}

// UpdateAccountParams contains the parameters for updating a account.
type UpdateAccountParams struct {
	FirstName
	LastName
}
