package shared

import (
	"time"
)

// Timestamps contains the timestamps for an entity.
type Timestamps struct {
	// CreatedAt is the timestamp of the creation.
	CreatedAt time.Time `json:"createdAt" format:"date-time"`
	// UpdatedAt is the timestamp of the last update. Null until the first update.
	UpdatedAt *time.Time `json:"updatedAt" format:"date-time"`
	// DeletedAt is the timestamp of the deletion. Null until the entity is deleted.
	DeletedAt *time.Time `json:"deletedAt" bun:",soft_delete" format:"date-time"`
}

type IntegerID struct {
	ID int `json:"id" minimum:"1" bun:",pk"`
}

type RoundIDField struct {
	RoundID int `json:"roundId" minimum:"1"`
}
