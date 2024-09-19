package round

import (
	"context"

	"fundlevel/internal/entities/offer"
	"fundlevel/internal/storage/postgres/shared"
)

func (s *RoundService) GetOffers(ctx context.Context, roundId int, limit int, cursor int) ([]offer.Offer, error) {
	paginationParams := shared.PaginationRequest{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Round().GetOffers(ctx, roundId, paginationParams)
}
