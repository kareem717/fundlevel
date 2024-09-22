package offer

import (
	"fundlevel/internal/entities/shared"

	"github.com/uptrace/bun"
)

// DynamicRound represents a dynamic round entity.
type DynamicRoundOffer struct {
	bun.BaseModel `bun:"table:dynamic_round_offers"`
	shared.IntegerID
	CreateDynamicRoundOfferParams
	shared.Timestamps
}

// CreateDynamicRoundParams contains the parameters for creating a new dynamic round.
type CreateDynamicRoundOfferParams struct {
	DynamicRoundID int `json:"dynamicRoundId" minimum:"1"`
	OfferID        int `json:"offerId" minimum:"1"`
}
