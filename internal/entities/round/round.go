package round

import (
	"fundlevel/internal/entities/shared"
	"time"

	"github.com/uptrace/bun"
)

// Round represents an round entity.
type Round struct {
	bun.BaseModel `bun:"table:rounds"`

	shared.IntegerID
	CreateRoundParams
}

// CreateRoundParams contains the parameters for creating a new round.
type CreateRoundParams struct {
	OfferedPercentage       float64   `json:"offeredPercentage" minimum:"0" maximum:"100"`
	MonetaryPercentageValue float64   `json:"monetaryPercentageValue" minimum:"0" maximum:"999999999999999.99"`
	MonetaryValueCurrency   string    `json:"monetaryValueCurrency" enums:"USD,GBP,EUR,CAD,AUD,JPY"`
	VentureID               int       `json:"ventureId" minimum:"1"`
	BeginsAt                time.Time `json:"beginsAt" format:"date-time"`
}
