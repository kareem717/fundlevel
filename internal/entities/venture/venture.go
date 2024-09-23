package venture

import (
	"fundlevel/internal/entities/shared"

	"github.com/uptrace/bun"
)

type Name struct {
	Name string `json:"name" minLength:"3" maxLength:"100"`
}

type Description struct {
	Description string `json:"description" minLength:"3" maxLength:"5000"`
}

type OwnerAccountID struct {
	OwnerAccountID int `json:"ownerAccountId" minimum:"1"`
}

// Venture represents an venture entity.
type Venture struct {
	bun.BaseModel `bun:"table:ventures"`

	shared.IntegerID
	shared.Timestamps
	Name
	Description
	OwnerAccountID
}

// CreateVentureParams contains the parameters for creating a new venture.
type CreateVentureParams struct {
	OwnerAccountID
	Name
	Description
}

// UpdateVentureParams contains the parameters for updating a venture.
type UpdateVentureParams struct {
	Name
	Description
}
