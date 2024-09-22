package offer

import (
	"context"
	"fundlevel/internal/entities/offer"
)

func (r *OfferRepository) CreateStaticRoundOffer(ctx context.Context, params offer.CreateStaticRoundOfferParams) (offer.StaticRoundOffer, error) {
	resp := offer.StaticRoundOffer{}

	err := r.db.
		NewInsert().
		Model(&params).
		ModelTableExpr("static_round_offers").
		Returning("*").
		Scan(ctx, &resp)

	return resp, err
}
