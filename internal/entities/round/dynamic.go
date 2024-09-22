package round

import (
	"fundlevel/internal/entities/shared"
	"time"

	"github.com/uptrace/bun"
)

// DynamicRound represents a dynamic round entity.
type DynamicRound struct {
	bun.BaseModel `bun:"table:dynamic_rounds"`
	shared.IntegerID
	CreateDynamicRoundParams
	shared.Timestamps
}

// DynamicRoundWithRound represents a dynamic round entity with its associated round.
type DynamicRoundWithRound struct {
	DynamicRound
	Round Round `bun:"-"`
}

// CreateDynamicRoundParams contains the parameters for creating a new dynamic round.
type CreateDynamicRoundParams struct {
	RoundID int `json:"roundId" minimum:"1"`
	UpdateDynamicRoundParams
}

// UpdateDynamicRoundParams contains the parameters for updating a dynamic round.
type UpdateDynamicRoundParams struct {
	MinimumMonetaryInvestmentValue float64   `json:"minimumMonetaryInvestmentValue" minimum:"0" maximum:"999999999999999.99"`
	EndsAt                         time.Time `json:"endsAt" format:"date-time"`
}
