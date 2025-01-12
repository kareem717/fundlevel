package analytic

import (
	"time"

	"github.com/uptrace/bun"
)

// RoundFavourite represents an round favourite entity.
type RoundFavourite struct {
	bun.BaseModel `bun:"table:round_favourites"`

	RoundID   int `json:"round_id" minimum:"1"`
	AccountID int `json:"account_id" minimum:"1"`

	CreatedAt time.Time  `json:"created_at" format:"date-time"`
	DeletedAt *time.Time `json:"deleted_at" bun:",soft_delete" format:"date-time"`
}

// BusinessFavourite represents an business favourite entity.
type BusinessFavourite struct {
	bun.BaseModel `bun:"table:business_favourites"`

	BusinessID int `json:"business_id" minimum:"1"`
	AccountID  int `json:"account_id" minimum:"1"`

	CreatedAt time.Time  `json:"created_at" format:"date-time"`
	DeletedAt *time.Time `json:"deleted_at" bun:",soft_delete" format:"date-time"`
}