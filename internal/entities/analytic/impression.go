package analytic

import (
	"time"

	"github.com/uptrace/bun"
)

// RoundImpression represents an round impression entity.
type RoundImpression struct {
	bun.BaseModel `bun:"table:round_impressions"`

	RoundID   int `json:"roundId" minimum:"1"`
	AccountID int `json:"accountId" minimum:"1"`

	// CreatedAt is the timestamp of the creation.
	CreatedAt time.Time `json:"createdAt" format:"date-time"`
}

// CreateRoundImpressionParams contains the parameters for creating a new round impression.
type CreateRoundImpressionParams struct {
	RoundID   int `json:"roundId" minimum:"1"`
	AccountID int `json:"accountId" minimum:"1"`
}

// VentureImpression represents an venture impression entity.
type VentureImpression struct {
	bun.BaseModel `bun:"table:venture_impressions"`

	VentureID int `json:"ventureId" minimum:"1"`
	AccountID int `json:"accountId" minimum:"1"`

	// CreatedAt is the timestamp of the creation.
	CreatedAt time.Time `json:"createdAt" format:"date-time"`
}

// CreateVentureImpressionParams contains the parameters for creating a new venture impression.
type CreateVentureImpressionParams struct {
	VentureID int `json:"ventureId" minimum:"1"`
	AccountID int `json:"accountId" minimum:"1"`
}

// BusinessImpression represents an business impression entity.
type BusinessImpression struct {
	bun.BaseModel `bun:"table:business_impressions"`

	BusinessID int `json:"businessId" minimum:"1"`
	AccountID  int `json:"accountId" minimum:"1"`

	// CreatedAt is the timestamp of the creation.
	CreatedAt time.Time `json:"createdAt" format:"date-time"`
}

// CreateBusinessImpressionParams contains the parameters for creating a new business impression.
type CreateBusinessImpressionParams struct {
	BusinessID int `json:"businessId" minimum:"1"`
	AccountID  int `json:"accountId" minimum:"1"`
}
