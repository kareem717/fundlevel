package venture

import (
	"fundlevel/internal/entities/address"
	"fundlevel/internal/entities/shared"

	"github.com/uptrace/bun"
)

// Venture represents an venture entity.
type Venture struct {
	bun.BaseModel `bun:"table:ventures"`

	VentureParams
	Address *address.Address `json:"address" bun:"rel:has-one,join:address_id=id"`

	shared.IntegerID
	shared.Timestamps
}

type VentureParams struct {
	BusinessID int  `json:"businessId" minimum:"1"`
	IsHidden   bool `json:"isHidden" readOnly:"true"`
	AddressID  int  `json:"addressId" minimum:"1" readOnly:"true"`
	UpdateVentureParams
}

// CreateVentureParams contains the parameters for creating a new venture.
type CreateVentureParams struct {
	Venture VentureParams               `json:"venture"`
	Address address.CreateAddressParams `json:"address"`
}

// UpdateVentureParams contains the parameters for updating a venture.
type UpdateVentureParams struct {
	Name        string `json:"name" minLength:"3" maxLength:"100"`
	Description string `json:"description" minLength:"3" maxLength:"5000"`
}
