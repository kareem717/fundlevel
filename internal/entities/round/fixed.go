package round

import (
	"fundlevel/internal/entities/shared"

	"github.com/uptrace/bun"
)

// FixedTotalRound represents an fixed total round entity.
type FixedTotalRound struct {
	bun.BaseModel `bun:"table:fixed_total_rounds"`

	createFixedTotalRoundParams
	Round *Round `bun:"rel:belongs-to,join:round_id=id"`
	shared.Timestamps
}

type createFixedTotalRoundParams struct {
	RoundID int
}

// CreateFixedTotalRoundParams contains the parameters for creating a new fixed total round.
type CreateFixedTotalRoundParams struct {
	FixedTotalRound createFixedTotalRoundParams `json:"-"`
	Round           CreateRoundParams           `json:"round"`
}
