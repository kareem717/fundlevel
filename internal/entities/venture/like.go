package venture

import (
	"time"

	"github.com/uptrace/bun"
)

// VentureLike represents an venture like entity.
type VentureLike struct {
	bun.BaseModel `bun:"table:venture_likes"`

	VentureID int `json:"ventureId" minimum:"1"`
	AccountID int `json:"accountId" minimum:"1"`

	// CreatedAt is the timestamp of the creation.
	CreatedAt time.Time `json:"createdAt" format:"date-time"`
}

// CreateVentureLikeParams contains the parameters for creating a new venture like.
type CreateVentureLikeParams struct {
	VentureID int `json:"ventureId" minimum:"1"`
	AccountID int `json:"accountId" minimum:"1"`
}
