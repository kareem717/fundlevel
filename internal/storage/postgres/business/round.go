package business

import (
	"context"

	"fundlevel/internal/entities/round"
	"fundlevel/internal/storage/postgres/shared"
)

func (r *BusinessRepository) GetRoundsByCursor(ctx context.Context, businessId int, paginationParams shared.CursorPagination) ([]round.Round, error) {
	resp := []round.Round{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Where("business_id = ?", businessId).
		Where("id >= ?", paginationParams.Cursor).
		Order("id").
		Limit(paginationParams.Limit).
		Scan(ctx)

	return resp, err
}

func (r *BusinessRepository) GetRoundsByPage(ctx context.Context, businessId int, paginationParams shared.OffsetPagination) ([]round.Round, error) {
	resp := []round.Round{}
	offset := (paginationParams.Page - 1) * paginationParams.PageSize

	err := r.db.
		NewSelect().
		Model(&resp).
		Where("business_id = ?", businessId).
		Order("id").
		Offset(offset).
		Limit(paginationParams.PageSize).
		Scan(ctx)

	return resp, err
}
