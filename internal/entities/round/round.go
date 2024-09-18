package round

import (
	"fundlevel/internal/entities/shared"
	"time"

	"github.com/uptrace/bun"
)

// Round represents an round entity.
type Round struct {
	bun.BaseModel `bun:"table:rounds"`

	shared.IntegerID
	CreateRoundParams
	shared.Timestamps
}

// CreateRoundParams contains the parameters for creating a new round.
type CreateRoundParams struct {
	OfferedPercentage           float64   `json:"offeredPercentage" multipleOf:"0.001" minimum:"0" maximum:"100"`
	USDPercentageValue          float64   `json:"usdPercentageValue" minimum:"0"`
	MinimumInvestmentPercentage float64   `json:"minimumInvestmentPercentage" multipleOf:"0.001" minimum:"0" maximum:"100"`
	MaximumInvestmentPercentage float64   `json:"maximumInvestmentPercentage" multipleOf:"0.001" minimum:"0" maximum:"100"`
	IsAuctioned                 bool      `json:"isAuctioned"`
	StartTime                   time.Time `json:"startTime" format:"date-time"`
	UpdateRoundParams
}

// UpdateRoundParams contains the parameters for updating a round.
type UpdateRoundParams struct {
	EndTime time.Time `json:"endTime" format:"date-time"`
}
