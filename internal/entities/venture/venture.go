package venture

import (
	"fundlevel/internal/entities/shared"

	"github.com/uptrace/bun"
)

// Venture represents an venture entity.
type Venture struct {
	bun.BaseModel `bun:"table:ventures"`

	CreateVentureParams
	shared.IntegerID
	shared.Timestamps
}

// CreateVentureParams contains the parameters for creating a new venture.
type CreateVentureParams struct {
	OwnerAccountID int `json:"ownerAccountId" minimum:"1"`
	UpdateVentureParams
}

// UpdateVentureParams contains the parameters for updating a venture.
type UpdateVentureParams struct {
	Name string `json:"name" minLength:"3" maxLength:"100"`
	Description string `json:"description" minLength:"3" maxLength:"5000"`
}
