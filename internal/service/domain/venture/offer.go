package venture

import (
	"context"

	"fundlevel/internal/entities/offer"
	"fundlevel/internal/storage/postgres/shared"
)

func (s *VentureService) GetOffers(ctx context.Context, id int, limit int, cursor int) ([]offer.Offer, error) {
	paginationParams := shared.PaginationRequest{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Venture().GetOffers(ctx, id, paginationParams)
}
