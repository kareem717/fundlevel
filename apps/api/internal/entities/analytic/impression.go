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

// BusinessImpression represents an business impression entity.
type BusinessImpression struct {
	bun.BaseModel `bun:"table:business_impressions"`

	BusinessID int `json:"businessId" minimum:"1"`
	AccountID  int `json:"accountId" minimum:"1"`

	// CreatedAt is the timestamp of the creation.
	CreatedAt time.Time `json:"createdAt" format:"date-time"`
}