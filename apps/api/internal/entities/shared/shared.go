package shared

import (
	"time"
)

type Currency string

const (
	USD Currency = "usd"
	GBP Currency = "gbp"
	EUR Currency = "eur"
	CAD Currency = "cad"
	AUD Currency = "aud"
	JPY Currency = "jpy"
)

// Timestamps contains the timestamps for an entity.
type Timestamps struct {
	// CreatedAt is the timestamp of the creation.
	CreatedAt time.Time `json:"created_at" format:"date-time"`
	// UpdatedAt is the timestamp of the last update. Null until the first update.
	UpdatedAt *time.Time `json:"updated_at" format:"date-time"`
	// DeletedAt is the timestamp of the deletion. Null until the entity is deleted.
	DeletedAt *time.Time `json:"deleted_at" bun:",soft_delete" format:"date-time"`
}

type BasicTimestamps struct {
	CreatedAt time.Time  `json:"created_at" format:"date-time"`
	UpdatedAt *time.Time `json:"updated_at" format:"date-time"`
}

type IntegerID struct {
	ID int `json:"id" minimum:"1" bun:",pk"`
}

type RoundIDField struct {
	RoundID int `json:"round_id" minimum:"1"`
}
