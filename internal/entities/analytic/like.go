package analytic

import (
	"time"

	"github.com/uptrace/bun"
)

// RoundLike represents an round like entity.
type RoundLike struct {
	bun.BaseModel `bun:"table:round_likes"`

	RoundID   int `json:"roundId" minimum:"1"`
	AccountID int `json:"accountId" minimum:"1"`

	CreatedAt time.Time  `json:"createdAt" format:"date-time"`
	DeletedAt *time.Time `json:"deletedAt" bun:",soft_delete" format:"date-time"`
}

// CreateRoundLikeParams contains the parameters for creating a new round like.
type CreateRoundLikeParams struct {
	RoundID   int `json:"roundId" minimum:"1"`
	AccountID int `json:"accountId" minimum:"1"`
}

// VentureLike represents an venture like entity.
type VentureLike struct {
	bun.BaseModel `bun:"table:venture_likes"`

	VentureID int `json:"ventureId" minimum:"1"`
	AccountID int `json:"accountId" minimum:"1"`

	CreatedAt time.Time  `json:"createdAt" format:"date-time"`
	DeletedAt *time.Time `json:"deletedAt" bun:",soft_delete" format:"date-time"`
}

// CreateVentureLikeParams contains the parameters for creating a new venture like.
type CreateVentureLikeParams struct {
	VentureID int `json:"ventureId" minimum:"1"`
	AccountID int `json:"accountId" minimum:"1"`
}

