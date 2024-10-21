package business

import (
	"context"

	"fundlevel/internal/entities/venture"
	"fundlevel/internal/storage/postgres/helper"
	postgres "fundlevel/internal/storage/shared"
)

func (r *BusinessRepository) GetVenturesByCursor(
	ctx context.Context,
	businessId int,
	paginationParams postgres.CursorPagination,
	filter venture.VentureFilter,
) ([]venture.Venture, error) {
	resp := []venture.Venture{}

	query := r.db.
		NewSelect().
		Model(&resp).
		Where("venture.business_id = ?", businessId).
		Limit(paginationParams.Limit)

	query = helper.ApplyVentureFilter(query, filter)
	cursorCondition := "venture.id >= ?"
	if filter.SortOrder != "asc" && paginationParams.Cursor > 0 {
		cursorCondition = "venture.id <= ?"
	}

	err := query.Where(cursorCondition, paginationParams.Cursor).Scan(ctx, &resp)

	return resp, err
}

func (r *BusinessRepository) GetVenturesByPage(
	ctx context.Context,
	businessId int,
	paginationParams postgres.OffsetPagination,
	filter venture.VentureFilter,
) ([]venture.Venture, int, error) {
	resp := []venture.Venture{}
	offset := (paginationParams.Page - 1) * paginationParams.PageSize

	query := r.db.
		NewSelect().
		Model(&resp).
		Where("venture.business_id = ?", businessId).
		Offset(offset).
		Limit(paginationParams.PageSize)

	query = helper.ApplyVentureFilter(query, filter)

	count, err := query.ScanAndCount(ctx, &resp)

	return resp, count, err
}
