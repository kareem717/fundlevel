package round

import (
	"fundlevel/internal/entities/shared"

	"github.com/uptrace/bun"
)

// RegularDynamicRound represents an regular dynamic round entity.
type RegularDynamicRound struct {
	bun.BaseModel `bun:"table:regular_dynamic_rounds"`

	RegularDynamicRoundParams
	RoundID int    `json:"roundId"`
	Round   *Round `json:"round" bun:"rel:belongs-to,join:round_id=id"`
	shared.Timestamps
}

type RegularDynamicRoundParams struct {
	RoundID         int `json:"roundId" readOnly:"true"`
	DaysExtendOnBid int `json:"daysExtendOnBid" minimum:"1"`
}

// CreateRegularDynamicRoundParams contains the parameters for creating a new regular dynamic round.
type CreateRegularDynamicRoundParams struct {
	RegularDynamicRound RegularDynamicRoundParams `json:"regularDynamicRound"`
	Round               CreateRoundParams         `json:"round"`
}
