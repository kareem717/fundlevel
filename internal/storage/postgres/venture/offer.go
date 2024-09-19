package venture

import (
	"context"

	"fundlevel/internal/entities/offer"
	"fundlevel/internal/storage/postgres/shared"
)

func (r *VentureRepository) GetOffers(ctx context.Context, ventureId int, paginationParams shared.PaginationRequest) ([]offer.Offer, error) {
	resp := []offer.Offer{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Join("JOIN rounds as r ON r.id = offer.round_id").
		Where("r.venture_id = ?", ventureId).
		Where("offer.id >= ?", paginationParams.Cursor).
		Order("offer.id").
		Limit(paginationParams.Limit).
		Scan(ctx)

	return resp, err
}
