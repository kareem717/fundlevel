package offer

import (
	"fundlevel/internal/entities/shared"

	"github.com/uptrace/bun"
)

// DynamicRound represents a dynamic round entity.
type StaticRoundOffer struct {
	bun.BaseModel `bun:"table:static_round_offers"`
	shared.IntegerID
	CreateStaticRoundOfferParams
	shared.Timestamps
}

// CreateDynamicRoundParams contains the parameters for creating a new dynamic round.
type CreateStaticRoundOfferParams struct {
	StaticRoundID int `json:"staticRoundId" minimum:"1"`
	OfferID       int `json:"offerId" minimum:"1"`
}
