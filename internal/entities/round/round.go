package round

import (
	"fundlevel/internal/entities/business"
	"fundlevel/internal/entities/shared"
	"time"

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
	BusinessID        int             `json:"businessId" minimum:"1"`
	BeginsAt          time.Time       `json:"beginsAt" format:"date-time"`
	EndsAt            time.Time       `json:"endsAt" format:"date-time"`
	PercentageOffered float64         `json:"percentageOffered" minimum:"0" maximum:"100"`
	PercentageValue   int             `json:"percentageValue" minimum:"1"`
	ValueCurrency     shared.Currency `json:"valueCurrency" enum:"usd,gbp,eur,cad,aud,jpy"`
	Status            RoundStatus     `json:"status" enum:"active,successful,failed"`
	InvestorCount     int             `json:"investorCount" minimum:"1"`
	BuyIn             float64         `json:"buyIn" minimum:"1"`
	Description       string          `json:"description" minLength:"10" maxLength:"3000"`

	Business *business.Business `json:"business" bun:"rel:belongs-to,join:business_id=id"`

	shared.Timestamps
}

// RoundFilter contains the parameters for filtering rounds.
type RoundFilter struct {
	MinimumBeginsAt time.Time `query:"minimumBeginsAt" format:"date-time" required:"false"`
	MaximumBeginsAt time.Time `query:"maximumBeginsAt" format:"date-time" required:"false"`

	MinimumEndsAt time.Time `query:"minimumEndsAt" format:"date-time" required:"false"`
	MaximumEndsAt time.Time `query:"maximumEndsAt" format:"date-time" required:"false"`

	MinimumPercentageOffered float64 `query:"minimumPercentageOffered" minimum:"0" maximum:"100" required:"false"`
	MaximumPercentageOffered float64 `query:"maximumPercentageOffered" minimum:"0" maximum:"100" required:"false"`

	MinimumPercentageValue int `query:"minimumPercentageValue" minimum:"0" required:"false"`
	MaximumPercentageValue int `query:"maximumPercentageValue" minimum:"1" required:"false"`

	ValueCurrencies shared.Currency `query:"valueCurrencies" enum:"usd,gbp,eur,cad,aud,jpy" required:"false"`

	Status []string `query:"status" enum:"active,successful,failed" required:"false"`

	MinimumInvestorCount int `query:"minimumInvestorCount" minimum:"1" required:"false"`
	MaximumInvestorCount int `query:"maximumInvestorCount" minimum:"1" required:"false"`

	MinimumBuyIn float64 `query:"minimumBuyIn" minimum:"1" required:"false"`
	MaximumBuyIn float64 `query:"maximumBuyIn" minimum:"1" required:"false"`

	SortBy    string `query:"sortBy" enum:"begins_at,ends_at,percentage_offered,percentage_value,value_currency,status,investor_count,buy_in,created_at" required:"false"`
	SortOrder string `query:"sortOrder" enum:"asc,desc" required:"false" default:"asc"`
}

// CreateRoundParams contains the parameters for creating a new round.
type CreateRoundParams struct {
	BusinessID        int             `json:"businessId" minimum:"1"`
	BeginsAt          time.Time       `json:"beginsAt" format:"date-time"`
	EndsAt            time.Time       `json:"endsAt" format:"date-time"`
	PercentageOffered float64         `json:"percentageOffered" minimum:"0" maximum:"100" example:"10"`
	ValueCurrency     shared.Currency `json:"valueCurrency" enum:"usd,gbp,eur,cad,aud,jpy"`
	PercentageValue   int             `json:"percentageValue" minimum:"1" example:"1000000"`
	Status            RoundStatus     `json:"status" hidden:"true" required:"false"`
	InvestorCount     int             `json:"investorCount" minimum:"1"`
	BuyIn             float64         `json:"buyIn" minimum:"1" hidden:"true" required:"false"`
	Description       string          `json:"description" minLength:"10" maxLength:"3000"`
}

type UpdateRoundParams struct {
	Status RoundStatus `json:"status" enum:"active,successful,failed"`
}
