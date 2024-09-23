package offer

import (
	"fundlevel/internal/entities/shared"

	"github.com/uptrace/bun"
)

type StaticRoundIDField struct {
	StaticRoundID int `json:"staticRoundId" minimum:"1"`
}

type OfferIDField struct {
	OfferID int `json:"offerId" minimum:"1"`
}

// StaticRound represents a static round entity.
type StaticRoundOffer struct {
	bun.BaseModel `bun:"table:static_round_offers"`
	shared.IntegerID
	StaticRoundIDField
	OfferIDField
	shared.Timestamps
}

// StaticRoundOfferWithOffer represents a static round offer entity with its associated offer.
type StaticRoundOfferWithOffer struct {
	StaticRoundOffer
	Offer Offer `bun:"-"`
}

// CreateStaticRoundOfferParams contains the parameters for creating a new static round offer.
type CreateStaticRoundOfferParams struct {
	StaticRoundIDField
	OfferIDField
}
