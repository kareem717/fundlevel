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

// CreateRoundFavouriteParams contains the parameters for creating a new round favourite.
type CreateRoundFavouriteParams struct {
	RoundID   int `json:"roundId" minimum:"1"`
	AccountID int `json:"accountId" minimum:"1"`
}

// BusinessFavourite represents an business favourite entity.
type BusinessFavourite struct {
	bun.BaseModel `bun:"table:business_favourites"`

	BusinessID int `json:"businessId" minimum:"1"`
	AccountID  int `json:"accountId" minimum:"1"`

	CreatedAt time.Time  `json:"createdAt" format:"date-time"`
	DeletedAt *time.Time `json:"deletedAt" bun:",soft_delete" format:"date-time"`
}

// CreateBusinessFavouriteParams contains the parameters for creating a new business favourite.
type CreateBusinessFavouriteParams struct {
	BusinessID int `json:"businessId" minimum:"1"`
	AccountID  int `json:"accountId" minimum:"1"`
}
