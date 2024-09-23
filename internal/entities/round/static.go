package round

import (
	"fundlevel/internal/entities/shared"
	"time"

	"github.com/uptrace/bun"
)

type EndsAtNullable struct {
	EndsAt *time.Time `json:"endsAt" format:"date-time"`
}

// StaticRound represents a static round entity.
type StaticRound struct {
	bun.BaseModel `bun:"table:static_rounds"`
	shared.IntegerID
	shared.RoundIDField
	EndsAtNullable
	shared.Timestamps
}

// StaticRoundWithRound represents a static round entity with its associated round.
type StaticRoundWithRound struct {
	StaticRound
	Round Round `bun:"-"`
}

// CreateStaticRoundParams contains the parameters for creating a new static round.
type CreateStaticRoundParams struct {
	shared.RoundIDField
	EndsAtNullable
}
