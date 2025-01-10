package analytic

import (
	"time"

	"github.com/uptrace/bun"
)

// RoundFavourite represents an round favourite entity.
type RoundFavourite struct {
	bun.BaseModel `bun:"table:round_favourites"`

	RoundID   int `json:"roundId" minimum:"1"`
	AccountID int `json:"accountId" minimum:"1"`

	CreatedAt time.Time  `json:"createdAt" format:"date-time"`
	DeletedAt *time.Time `json:"deletedAt" bun:",soft_delete" format:"date-time"`
}

// BusinessFavourite represents an business favourite entity.
type BusinessFavourite struct {
	bun.BaseModel `bun:"table:business_favourites"`

	BusinessID int `json:"businessId" minimum:"1"`
	AccountID  int `json:"accountId" minimum:"1"`

	CreatedAt time.Time  `json:"createdAt" format:"date-time"`
	DeletedAt *time.Time `json:"deletedAt" bun:",soft_delete" format:"date-time"`
}