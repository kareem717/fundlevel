package business

import (
	"context"
	"fmt"

	"fundlevel/internal/entities/venture"
	postgres "fundlevel/internal/storage/shared"

	"github.com/uptrace/bun"
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

	if len(filter.SortOrder) > 0 {
		query.OrderExpr(fmt.Sprintf("venture.id %s", filter.SortOrder))
	}

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

	if len(filter.SortOrder) > 0 {
		query.OrderExpr(fmt.Sprintf("venture.id %s", filter.SortOrder))
	}

	if len(filter.IsHidden) > 0 {
		query.Where("venture.is_hidden IN (?)", bun.In(filter.IsHidden))
	}

	count, err := query.ScanAndCount(ctx, &resp)

	return resp, count, err
}
