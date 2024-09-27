package round

import (
	"fundlevel/internal/entities/shared"

	"github.com/uptrace/bun"
)

// DutchDynamicRound represents an dutch dynamic round entity.
type DutchDynamicRound struct {
	bun.BaseModel `bun:"table:dutch_dynamic_rounds"`

	DutchDynamicRoundParams
	RoundID int    `json:"roundId"`
	Round   *Round `json:"round" bun:"rel:belongs-to,join:round_id=id"`
	shared.Timestamps
}

type DutchDynamicRoundParams struct {
	RoundID                   int `json:"roundId" readOnly:"true"`
	ValuationDollarDropRate   int `json:"valuationDollarDropRate"`
	ValuationStopLoss         int `json:"valuationStopLoss"`
	ValuationDropIntervalDays int `json:"valuationDropIntervalDays"`
}

// CreateDutchDynamicRoundParams contains the parameters for creating a new dutch dynamic round.
type CreateDutchDynamicRoundParams struct {
	DutchDynamicRound DutchDynamicRoundParams `json:"dutchDynamicRound"`
	Round             CreateRoundParams       `json:"round"`
}
