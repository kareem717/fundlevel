package round

import (
	"fundlevel/internal/entities/shared"

	"github.com/uptrace/bun"
)

// DynamicRound represents a dynamic round entity.
type StaticRound struct {
	bun.BaseModel `bun:"table:static_rounds"`
	shared.IntegerID
	CreateStaticRoundParams
	shared.Timestamps
}

// StaticRoundWithRound represents a static round entity with its associated round.
type StaticRoundWithRound struct {
	StaticRound
	Round Round `bun:"-"`
}

// CreateDynamicRoundParams contains the parameters for creating a new dynamic round.
type CreateStaticRoundParams struct {
	RoundID int `json:"roundId" minimum:"1"`
}
