package round

import (
	"fundlevel/internal/entities/shared"
	"fundlevel/internal/entities/venture"
	"time"

	"github.com/uptrace/bun"
)

type Currency string

const (
	USD Currency = "usd"
	GBP Currency = "gbp"
	EUR Currency = "eur"
	CAD Currency = "cad"
	AUD Currency = "aud"
	JPY Currency = "jpy"
)

type RoundStatus string

const (
	Active     RoundStatus = "active"
	Successful RoundStatus = "successful"
	Failed     RoundStatus = "failed"
)

// Round represents an round entity.
type Round struct {
	bun.BaseModel `bun:"table:rounds"`

	shared.IntegerID
	VentureID         int         `json:"ventureId" minimum:"1"`
	BeginsAt          time.Time   `json:"beginsAt" format:"date-time"`
	EndsAt            time.Time   `json:"endsAt" format:"date-time"`
	PercentageOffered float64     `json:"percentageOffered" minimum:"0" maximum:"100"`
	PercentageValue   int         `json:"percentageValue" minimum:"1"`
	ValueCurrency     Currency    `json:"valueCurrency" enum:"usd,gbp,eur,cad,aud,jpy"`
	Status            RoundStatus `json:"status" enum:"active,successful,failed"`
	InvestorCount     int         `json:"investorCount" minimum:"1"`
	BuyIn             float64     `json:"buyIn" minimum:"1"`
	Description       string      `json:"description" minLength:"10" maxLength:"3000"`

	Venture *venture.Venture `json:"venture" bun:"rel:belongs-to,join:venture_id=id"`

	shared.Timestamps
}

// CreateRoundParams contains the parameters for creating a new round.
type CreateRoundParams struct {
	VentureID         int         `json:"ventureId" minimum:"1"`
	BeginsAt          time.Time   `json:"beginsAt" format:"date-time"`
	EndsAt            time.Time   `json:"endsAt" format:"date-time"`
	PercentageOffered float64     `json:"percentageOffered" minimum:"0" maximum:"100"`
	ValueCurrency     Currency    `json:"valueCurrency" enum:"usd,gbp,eur,cad,aud,jpy"`
	PercentageValue   int         `json:"percentageValue" minimum:"1"`
	Status            RoundStatus `json:"status" hidden:"true"`
	InvestorCount     int         `json:"investorCount" minimum:"1"`
	BuyIn             float64     `json:"buyIn" minimum:"1" hidden:"true"`
	Description       string      `json:"description" minLength:"10" maxLength:"3000"`
}
