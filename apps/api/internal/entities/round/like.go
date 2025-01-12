package round

import (
	"time"

	"github.com/uptrace/bun"
)

// RoundLike represents an round like entity.
type RoundLike struct {
	bun.BaseModel `bun:"table:round_likes"`

	RoundID   int `json:"round_id" minimum:"1"`
	AccountID int `json:"account_id" minimum:"1"`

	// CreatedAt is the timestamp of the creation.
	CreatedAt time.Time `json:"created_at" format:"date-time"`
}
