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
	UserId uuid.UUID `json:"user_id" minimum:"1"`
	shared.Timestamps
}

type SafeAccount struct {
	bun.BaseModel `bun:"table:accounts,alias:account"`
	shared.IntegerID
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	shared.Timestamps
}

// CreateAccountParams contains the parameters for creating a new account.
type CreateAccountParams struct {
	UpdateAccountParams
}

// UpdateAccountParams contains the parameters for updating a account.
type UpdateAccountParams struct {
	FirstName string `json:"first_name" minLength:"3" maxLength:"30" pattern:"^[a-zA-Z]+$"`
	LastName  string `json:"last_name" minLength:"3" maxLength:"30" pattern:"^[a-zA-Z]+$"`
}
