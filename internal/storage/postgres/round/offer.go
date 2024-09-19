package round

import (
	"context"

	"fundlevel/internal/entities/offer"
	"fundlevel/internal/storage/postgres/shared"
)

func (r *RoundRepository) GetOffers(ctx context.Context, roundId int, paginationParams shared.PaginationRequest) ([]offer.Offer, error) {
	resp := []offer.Offer{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Join("JOIN rounds as r ON r.id = offer.round_id").
		Where("r.id = ?", roundId).
		Where("offer.id >= ?", paginationParams.Cursor).
		Order("offer.id").
		Limit(paginationParams.Limit).
		Scan(ctx)

	return resp, err
}
