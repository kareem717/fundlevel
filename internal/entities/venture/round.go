package venture

import (
	"fundlevel/internal/entities/shared"

	"github.com/uptrace/bun"
)

// VentureRounds represents an venture rounds entity.
type VentureRounds struct {
	bun.BaseModel `bun:"table:venture_rounds"`

	shared.IntegerID
	CreateVentureRoundsParams
	shared.Timestamps
}

// CreateVentureRoundsParams contains the parameters for creating a new venture rounds.
type CreateVentureRoundsParams struct {
	VentureRoundID int `json:"ventureRoundId" minimum:"1"`
	shared.RoundIDField
}
