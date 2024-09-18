package offer

import (
	"context"
	"errors"

	"fundlevel/internal/entities/offer"
	"fundlevel/internal/storage"
	"fundlevel/internal/storage/postgres/shared"
)

type OfferService struct {
	repositories storage.Repository
}

// NewTestService returns a new instance of test service.
func NewOfferService(repositories storage.Repository) *OfferService {
	return &OfferService{
		repositories: repositories,
	}
}

func (s *OfferService) GetById(ctx context.Context, id int) (offer.Offer, error) {
	return s.repositories.Offer().GetById(ctx, id)
}

func (s *OfferService) GetByRoundId(ctx context.Context, roundId int, limit int, cursor int) ([]offer.Offer, error) {
	paginationParams := shared.PaginationRequest{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Offer().GetByRoundId(ctx, roundId, paginationParams)
}

func (s *OfferService) GetAll(ctx context.Context, limit int, cursor int) ([]offer.Offer, error) {
	paginationParams := shared.PaginationRequest{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Offer().GetAll(ctx, paginationParams)
}

func (s *OfferService) Create(ctx context.Context, params offer.CreateOfferParams) (offer.Offer, error) {
	return s.repositories.Offer().Create(ctx, params)
}

func (s *OfferService) Delete(ctx context.Context, id int) error {
	return s.repositories.Offer().Delete(ctx, id)
}

func (s *OfferService) UpdateStatus(ctx context.Context, id int, status offer.OfferStatus) (offer.Offer, error) {
	if status == offer.OfferStatusPending {
		return offer.Offer{}, errors.New("cannot update offer status to pending")
	}

	current, err := s.repositories.Offer().GetById(ctx, id)
	if err != nil {
		return offer.Offer{}, err
	}

	if current.Status != offer.OfferStatusPending {
		return offer.Offer{}, errors.New("offer status is not pending")
	}

	return s.repositories.Offer().Update(ctx, id, offer.UpdateOfferParams{Status: status})
}
