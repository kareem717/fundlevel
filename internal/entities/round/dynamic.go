package round

import (
	"fundlevel/internal/entities/shared"
	"time"

	"github.com/uptrace/bun"
)

type MinimumMonetaryInvestmentValueField struct {
	MinimumMonetaryInvestmentValue float64 `json:"minimumMonetaryInvestmentValue" minimum:"0" maximum:"999999999999999.99"`
}

type EndsAtField struct {
	EndsAt time.Time `json:"endsAt" format:"date-time"`
}

// DynamicRound represents a dynamic round entity.
type DynamicRound struct {
	bun.BaseModel `bun:"table:dynamic_rounds"`
	shared.IntegerID
	shared.RoundIDField
	MinimumMonetaryInvestmentValueField
	EndsAtField
	shared.Timestamps
}

// DynamicRoundWithRound represents a dynamic round entity with its associated round.
type DynamicRoundWithRound struct {
	DynamicRound
	Round Round `bun:"-"`
}

// CreateDynamicRoundParams contains the parameters for creating a new dynamic round.
type CreateDynamicRoundParams struct {
	shared.RoundIDField
	MinimumMonetaryInvestmentValueField
	EndsAtField
}

// UpdateDynamicRoundParams contains the parameters for updating a dynamic round.
type UpdateDynamicRoundParams struct {
	shared.RoundIDField
	MinimumMonetaryInvestmentValueField
	EndsAtField
}
