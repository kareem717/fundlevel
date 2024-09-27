package round

import (
	"fundlevel/internal/entities/shared"

	"github.com/uptrace/bun"
)

// PartialFixedTotalRound represents an partial fixed total round entity.
type PartialTotalRound struct {
	bun.BaseModel `bun:"table:partial_total_rounds"`

	PartialTotalRoundParams
	RoundID int    `json:"roundId"`
	Round   *Round `json:"round" bun:"rel:belongs-to,join:round_id=id"`
	shared.Timestamps
}

type PartialTotalRoundParams struct {
	RoundID        int `json:"roundId" readOnly:"true"`
	InvestorCount int `json:"investorCount"`
}

// CreatePartialFixedTotalRoundParams contains the parameters for creating a new partial fixed total round.
type CreatePartialTotalRoundParams struct {
	PartialTotalRound PartialTotalRoundParams `json:"partialTotalRound"`
	Round             CreateRoundParams       `json:"round"`
}
