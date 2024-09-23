package offer

import (
	"fundlevel/internal/entities/shared"

	"github.com/uptrace/bun"
)

type DynamicRoundIDField struct {
	DynamicRoundID int `json:"dynamicRoundId" minimum:"1"`
}

// DynamicRound represents a dynamic round entity.
type DynamicRoundOffer struct {
	bun.BaseModel `bun:"table:dynamic_round_offers"`
	shared.IntegerID
	DynamicRoundIDField
	OfferIDField
	shared.Timestamps
}

// DynamicRoundOfferWithOffer represents a dynamic round offer entity with its associated offer.
type DynamicRoundOfferWithOffer struct {
	DynamicRoundOffer
	Offer Offer `bun:"-"`
}

// CreateDynamicRoundParams contains the parameters for creating a new dynamic round.
type CreateDynamicRoundOfferParams struct {
	DynamicRoundIDField
	OfferIDField
}
