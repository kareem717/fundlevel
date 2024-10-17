package venture

import (
	"fundlevel/internal/entities/business"
	"fundlevel/internal/entities/shared"

	"github.com/uptrace/bun"
)

// Venture represents an venture entity.
type Venture struct {
	bun.BaseModel `bun:"table:ventures"`

	BusinessID int                `json:"businessId" minimum:"1"`
	IsHidden   bool               `json:"isHidden"`
	Business   *business.Business `json:"business" bun:"rel:has-one,join:business_id=id"`

	UpdateVentureParams
	shared.IntegerID
	shared.Timestamps
}

// CreateVentureParams contains the parameters for creating a new venture.
type CreateVentureParams struct {
	BusinessID int  `json:"businessId" minimum:"1"`
	IsHidden   bool `json:"isHidden" hidden:"true"`
	UpdateVentureParams
}

// UpdateVentureParams contains the parameters for updating a venture.
type UpdateVentureParams struct {
	Name        string `json:"name" minLength:"3" maxLength:"100"`
	Description string `json:"description" minLength:"3" maxLength:"5000"`
}
