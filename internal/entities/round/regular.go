package round

import (
	"fundlevel/internal/entities/shared"

	"github.com/uptrace/bun"
)

// RegularDynamicRound represents an regular dynamic round entity.
type RegularDynamicRound struct {
	bun.BaseModel `bun:"table:regular_dynamic_rounds"`

	createRegularDynamicRoundParams
	RoundID int `json:"roundId"`
	Round *Round `json:"round" bun:"rel:belongs-to,join:round_id=id"`
	shared.Timestamps
}

type createRegularDynamicRoundParams struct {
	RoundID int `json:"roundId" readOnly:"true"`
	DaysExtendOnBid int `json:"daysExtendOnBid"`
}

// CreateFixedTotalRoundParams contains the parameters for creating a new fixed total round.
type CreateRegularDynamicRoundParams struct {
	RegularDynamicRound createRegularDynamicRoundParams `json:"regularDynamicRound"`
	Round               CreateRoundParams               `json:"round"`
}
