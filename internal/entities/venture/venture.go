package venture

import (
	"fundlevel/internal/entities/shared"

	"github.com/uptrace/bun"
)

// Venture represents an venture entity.
type Venture struct {
	bun.BaseModel `bun:"table:ventures"`

	ID   int    `json:"id"`
	Name string `json:"name"`
	shared.Timestamps
}

// CreateVentureParams contains the parameters for creating a new venture.
type CreateVentureParams struct {
	Name string `json:"name"`
}

// UpdateVentureParams contains the parameters for updating a venture.
type UpdateVentureParams struct {
	Name string `json:"name"`
}
