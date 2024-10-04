package round

import (
	"fundlevel/internal/entities/shared"
	"time"

	"github.com/uptrace/bun"
)

type Currency string

const (
	USD Currency = "USD"
	GBP Currency = "GBP"
	EUR Currency = "EUR"
	CAD Currency = "CAD"
	AUD Currency = "AUD"
	JPY Currency = "JPY"
)

type RoundStatus string

const (
	Active     RoundStatus = "active"
	Successful RoundStatus = "successful"
	Failed     RoundStatus = "failed"
)

// Round represents an round entity.
type Round struct {
	bun.BaseModel `bun:"table:rounds"`

	shared.IntegerID
	CreateRoundParams

	shared.Timestamps
}

type RoundWithSubtypes struct {
	bun.BaseModel `bun:"table:rounds"`
	Round
	FixedTotalRound     *FixedTotalRound     `json:"fixedTotalRound" bun:"rel:has-one,join:id=round_id"`
	DutchDynamicRound   *DutchDynamicRound   `json:"dutchDynamicRound" bun:"rel:has-one,join:id=round_id"`
	PartialTotalRound   *PartialTotalRound   `json:"partialTotalRound" bun:"rel:has-one,join:id=round_id"`
	RegularDynamicRound *RegularDynamicRound `json:"regularDynamicRound" bun:"rel:has-one,join:id=round_id"`
}

// CreateRoundParams contains the parameters for creating a new round.
type CreateRoundParams struct {
	VentureID         int         `json:"ventureId" minimum:"1"`
	BeginsAt          time.Time   `json:"beginsAt" format:"date-time"`
	EndsAt            time.Time   `json:"endsAt" format:"date-time"`
	PercentageOffered float64     `json:"percentageOffered" minimum:"0" maximum:"100"`
	PercentageValue   int         `json:"percentageValue" minimum:"1"`
	ValueCurrency     Currency    `json:"valueCurrency" enum:"USD,GBP,EUR,CAD,AUD,JPY"`
	Status            RoundStatus `json:"status" enum:"active,successful,failed"`
}

type RoundType string

const (
	RoundTypeFixedTotal     RoundType = "fixedTotal"
	RoundTypeDutchDynamic   RoundType = "dutchDynamic"
	RoundTypePartialTotal   RoundType = "partialTotal"
	RoundTypeRegularDynamic RoundType = "regularDynamic"
)

type RoundFilter struct {
	Status    []string  `json:"status" enum:"active,successful,failed" query:"status"`
	MinEndsAt time.Time `json:"minEndsAt" format:"date-time" query:"minEndsAt"`
	MaxEndsAt time.Time `json:"maxEndsAt" format:"date-time" query:"maxEndsAt"`
	// Type   []RoundType `json:"type" enum:"fixedTotal,dutchDynamic,partialTotal,regularDynamic"`
}
