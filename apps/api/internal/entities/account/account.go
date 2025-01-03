package account

import (
	"fundlevel/internal/entities/shared"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

// Account represents an account entity.
type Account struct {
	bun.BaseModel `bun:"table:accounts"`

	shared.IntegerID
	CreateAccountParams
	shared.Timestamps
}

type SafeAccount struct {
	bun.BaseModel `bun:"table:accounts,alias:account"`
	shared.IntegerID
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	shared.Timestamps
}

// CreateAccountParams contains the parameters for creating a new account.
type CreateAccountParams struct {
	UpdateAccountParams
	UserID uuid.UUID `json:"userId" format:"uuid" minLength:"36" maxLength:"36"`
}

// UpdateAccountParams contains the parameters for updating a account.
type UpdateAccountParams struct {
	FirstName string `json:"firstName" minLength:"3" maxLength:"30" pattern:"^[a-zA-Z]+$"`
	LastName  string `json:"lastName" minLength:"3" maxLength:"30" pattern:"^[a-zA-Z]+$"`
}
