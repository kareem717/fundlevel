package business

import (
	"context"

	"fundlevel/internal/entities/venture"
	"fundlevel/internal/storage/postgres/shared"
)

func (r *BusinessRepository) GetVenturesByCursor(ctx context.Context, businessId int, paginationParams shared.CursorPagination) ([]venture.Venture, error) {
	resp := []venture.Venture{}

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

func (r *BusinessRepository) GetVenturesByPage(ctx context.Context, businessId int, paginationParams shared.OffsetPagination) ([]venture.Venture, int, error) {
	resp := []venture.Venture{}
	offset := (paginationParams.Page - 1) * paginationParams.PageSize

	count, err := r.db.
		NewSelect().
		Model(&resp).
		Where("venture.business_id = ?", businessId).
		Order("venture.id").
		Offset(offset).
		Limit(paginationParams.PageSize).
		GroupExpr("venture.id").
		ScanAndCount(ctx)

	return resp, count, err
}
