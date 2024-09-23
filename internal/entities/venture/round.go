package venture

import (
	"fundlevel/internal/entities/shared"

	"github.com/uptrace/bun"
)

type VentureRoundID struct {
	VentureRoundID int `json:"ventureRoundId" minimum:"1"`
}

// VentureRounds represents an venture rounds entity.
type VentureRounds struct {
	bun.BaseModel `bun:"table:venture_rounds"`

	shared.IntegerID
	VentureRoundID
	shared.RoundIDField
	shared.Timestamps
}

// CreateVentureRoundsParams contains the parameters for creating a new venture rounds.
type CreateVentureRoundsParams struct {
	VentureRoundID
	shared.RoundIDField
}
