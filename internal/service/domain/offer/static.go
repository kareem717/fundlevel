package offer

import (
	"context"
	"fundlevel/internal/entities/offer"
	"fundlevel/internal/storage"
)

func (s *OfferService) CreateStatic(ctx context.Context, params offer.CreateStaticRoundOfferParams, offerParams offer.CreateOfferParams) (offer.StaticRoundOfferWithOffer, error) {
	output := offer.StaticRoundOfferWithOffer{}

	err := s.repositories.RunInTx(ctx, func(ctx context.Context, tx storage.Transaction) error {
		offer, err := tx.Offer().Create(ctx, offerParams)
		if err != nil {
			return err
		}
		output.Offer = offer

		params.OfferID = offer.ID
		static, err := tx.Offer().CreateStaticRoundOffer(ctx, params)
		if err != nil {
			return err
		}

		output.StaticRoundOffer = static
		return nil
	})

	return output, err
}
