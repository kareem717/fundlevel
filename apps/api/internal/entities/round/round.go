package round

import (
	"fundlevel/internal/entities/shared"

	"github.com/uptrace/bun"
)

type RoundStatus string

const (
	RoundStatusActive     RoundStatus = "active"
	RoundStatusSuccessful RoundStatus = "successful"
	RoundStatusFailed     RoundStatus = "failed"
)

// Round represents an round entity.
type Round struct {
	bun.BaseModel `bun:"table:rounds"`

	shared.IntegerID
	BusinessID            int         `json:"businessId" minimum:"1"`
	PricePerShareUSDCents int         `json:"pricePerShareUSDCents" minimum:"1"`
	TotalSharesForSale    int         `json:"totalSharesForSale" minimum:"1"`
	TotalBusinessShares   int         `json:"totalBusinessShares" minimum:"1"`
	Status                RoundStatus `json:"status" enum:"active,successful,failed"`
	Description           string      `json:"description" minLength:"10" maxLength:"3000"`

	shared.Timestamps
}

type CreateRoundParams struct {
	bun.BaseModel `bun:"table:rounds,alias:round"`

	BusinessID            int         `json:"businessId" minimum:"1"`
	PricePerShareUSDCents int         `json:"pricePerShareUSDCents" minimum:"23"`
	TotalSharesForSale    int         `json:"totalSharesForSale" minimum:"1000"`
	TotalBusinessShares   int         `json:"totalBusinessShares" minimum:"100000"`
	Status                RoundStatus `json:"status" hidden:"true" required:"false"`
	Description           string      `json:"description" minLength:"10" maxLength:"3000"`
}

type UpdateRoundParams struct {
	bun.BaseModel `bun:"table:rounds,alias:round"`

	Description string       `json:"description" minLength:"10" maxLength:"3000"`
	Status      *RoundStatus `json:"status" enum:"active,successful,failed" hidden:"true" required:"false"`
}
