package round

import (
	"fundlevel/internal/entities/shared"
	"time"

	"github.com/uptrace/bun"
)

type MonetaryValueCurrency string

const (
	USD MonetaryValueCurrency = "usd"
	GBP MonetaryValueCurrency = "gbp"
	EUR MonetaryValueCurrency = "eur"
	CAD MonetaryValueCurrency = "cad"
	AUD MonetaryValueCurrency = "aud"
	JPY MonetaryValueCurrency = "jpy"
)

// Round represents an round entity.
type Round struct {
	bun.BaseModel `bun:"table:rounds"`

	shared.IntegerID
	CreateRoundParams
	shared.Timestamps
}

// CreateRoundParams contains the parameters for creating a new round.
type CreateRoundParams struct {
	OfferedPercentage       float64               `json:"offeredPercentage" minimum:"0" maximum:"100"`
	MonetaryPercentageValue float64               `json:"monetaryPercentageValue" minimum:"0" maximum:"999999999999999.99"`
	MonetaryValueCurrency   MonetaryValueCurrency `json:"monetaryValueCurrency" enums:"usd,gbp,eur,cad,aud,jpy"`
	VentureID               int                   `json:"ventureId" minimum:"1"`
	BeginsAt                time.Time             `json:"beginsAt" format:"date-time"`
}
