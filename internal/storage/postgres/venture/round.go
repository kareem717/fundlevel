package venture

import (
	"context"

	"fundlevel/internal/entities/round"
	"fundlevel/internal/storage/postgres/shared"
)

func (r *VentureRepository) GetRounds(ctx context.Context, ventureId int, paginationParams shared.PaginationRequest) ([]round.Round, error) {
	resp := []round.Round{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Where("venture_id = ?", ventureId).
		Where("id >= ?", paginationParams.Cursor).
		Order("id").
		Limit(paginationParams.Limit).
		Scan(ctx)

	return resp, err
}
