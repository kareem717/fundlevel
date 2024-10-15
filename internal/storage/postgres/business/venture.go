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
		Relation("Address").
		Where("business_id = ?", businessId).
		Where("id >= ?", paginationParams.Cursor).
		Order("venture.id").
		Limit(paginationParams.Limit).
		Scan(ctx)

	return resp, err
}

func (r *BusinessRepository) GetVenturesByPage(ctx context.Context, businessId int, paginationParams shared.OffsetPagination) ([]venture.Venture, error) {
	resp := []venture.Venture{}
	offset := (paginationParams.Page - 1) * paginationParams.PageSize

	err := r.db.
		NewSelect().
		Model(&resp).
		Relation("Address").
		Where("business_id = ?", businessId).
		Order("venture.id").
		Offset(offset).
		Limit(paginationParams.PageSize).
		Scan(ctx)

	return resp, err
}

func (r *BusinessRepository) GetVentures(ctx context.Context, businessId int) ([]venture.VentureSimple, error) {
	resp := []venture.VentureSimple{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Where("business_id = ?", businessId).
		Scan(ctx)

	return resp, err
}
	