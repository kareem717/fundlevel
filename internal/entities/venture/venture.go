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

type TeamSize string

const (
	TeamSize0_1      TeamSize = "0-1"
	TeamSize2_10     TeamSize = "2-10"
	TeamSize11_50    TeamSize = "11-50"
	TeamSize51_200   TeamSize = "51-200"
	TeamSize201_500  TeamSize = "201-500"
	TeamSize501_1000 TeamSize = "501-1000"
	TeamSize1000Plus TeamSize = "1000+"
)

type VentureParams struct {
	BusinessID int      `json:"businessId" minimum:"1"`
	IsHidden   bool     `json:"isHidden" readOnly:"true"`
	TeamSize   TeamSize `json:"teamSize" enum:"0-1,2-10,11-50,51-200,201-500,501-1000,1000+"`
	IsRemote   bool     `json:"isRemote" default:"false"`
	AddressID  *int     `json:"addressId,omitempty" minimum:"1" readOnly:"true"`
	UpdateVentureParams
}

// CreateVentureParams contains the parameters for creating a new venture.
type CreateVentureParams struct {
	Venture VentureParams                `json:"venture"`
	Address *address.CreateAddressParams `json:"address,omitempty"`
}

// UpdateVentureParams contains the parameters for updating a venture.
type UpdateVentureParams struct {
	Name        string `json:"name" minLength:"3" maxLength:"100"`
	Description string `json:"description" minLength:"3" maxLength:"5000"`
}

type VentureSimple struct {
	bun.BaseModel `bun:"table:ventures"`

	shared.IntegerID
	Name string `json:"name"`

	shared.Timestamps
}
