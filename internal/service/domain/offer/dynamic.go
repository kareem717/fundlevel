package offer

import (
	"context"
	"fundlevel/internal/entities/offer"
	"fundlevel/internal/storage"
)

func (s *OfferService) CreateDynamic(ctx context.Context, params offer.CreateDynamicRoundOfferParams, offerParams offer.CreateOfferParams) (offer.DynamicRoundOfferWithOffer, error) {
	output := offer.DynamicRoundOfferWithOffer{}

	err := s.repositories.RunInTx(ctx, func(ctx context.Context, tx storage.Transaction) error {
		offer, err := tx.Offer().Create(ctx, offerParams)
		if err != nil {
			return err
		}
		output.Offer = offer

		params.OfferID = offer.ID
		dynamic, err := tx.Offer().CreateDynamicRoundOffer(ctx, params)
		if err != nil {
			return err
		}

		output.DynamicRoundOffer = dynamic
		return nil
	})

	return output, err
}
