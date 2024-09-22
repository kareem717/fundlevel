package offer

import (
	"context"
	"fundlevel/internal/entities/offer"
)

func (r *OfferRepository) CreateDynamicRoundOffer(ctx context.Context, params offer.CreateDynamicRoundOfferParams) (offer.DynamicRoundOffer, error) {
	resp := offer.DynamicRoundOffer{}

	err := r.db.
		NewInsert().
		Model(&params).
		ModelTableExpr("dynamic_round_offers").
		Returning("*").
		Scan(ctx, &resp)

	return resp, err
}
