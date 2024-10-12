package address

import (
	"encoding/json"
	"fundlevel/internal/entities/shared"

	"github.com/uptrace/bun"
)

type Address struct {
	bun.BaseModel `bun:"table:addresses"`
	shared.IntegerID

	CreateAddressParams
	shared.Timestamps
}

type CreateAddressParams struct {
	XCoordinate float64         `json:"xCoordinate"`
	YCoordinate float64         `json:"yCoordinate"`
	Line1       string          `json:"line1" bun:"line_1"`
	Line2       string          `json:"line2" bun:"line_2"`
	City        string          `json:"city"`
	Region      string          `json:"region"`
	PostalCode  string          `json:"postalCode"`
	Country     string          `json:"country"`
	RawJSON     json.RawMessage `json:"rawJson"`
	District    string          `json:"district"`
	RegionCode  string          `json:"regionCode"`
	FullAddress string          `json:"fullAddress"`
}
