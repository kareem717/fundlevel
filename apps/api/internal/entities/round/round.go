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
	BusinessID            int         `json:"business_id" minimum:"1"`
	PricePerShareUSDCents int         `json:"price_per_share_usd_cents" minimum:"1"`
	TotalSharesForSale    int         `json:"total_shares_for_sale" minimum:"1"`
	TotalBusinessShares   int         `json:"total_business_shares" minimum:"1"`
	TermsID               int         `json:"terms_id" minimum:"1"`
	Status                RoundStatus `json:"status" enum:"active,successful,failed"`
	Description           string      `json:"description" minLength:"10" maxLength:"3000"`

	shared.Timestamps
}

type CreateRoundParams struct {
	Round struct {
		bun.BaseModel `bun:"table:rounds,alias:round"`

		BusinessID            int         `json:"business_id" minimum:"1"`
		PricePerShareUSDCents int         `json:"price_per_share_usd_cents" example:"23" minimum:"1"`
		TotalSharesForSale    int         `json:"total_shares_for_sale" example:"1000" minimum:"1"`
		TotalBusinessShares   int         `json:"total_business_shares" example:"100000" minimum:"1"`
		Status                RoundStatus `json:"status" hidden:"true" required:"false"`
		Description           string      `json:"description" minLength:"10" maxLength:"3000"`
	} `json:"round"`
	Terms CreateRoundTermParams `json:"terms"`
}

type UpdateRoundParams struct {
	bun.BaseModel `bun:"table:rounds,alias:round"`

	Description string       `json:"description" minLength:"10" maxLength:"3000"`
	Status      *RoundStatus `json:"status" enum:"active,successful,failed" hidden:"true" required:"false"`
}
