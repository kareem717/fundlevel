package business

import (
	"context"

	"fundlevel/internal/entities/round"
	postgres "fundlevel/internal/storage/shared"
)

func (r *BusinessRepository) GetRoundsByCursor(ctx context.Context, businessId int, paginationParams postgres.CursorPagination) ([]round.Round, error) {
	resp := []round.Round{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Join("JOIN ventures ON ventures.id = round.venture_id").
		Where("ventures.business_id = ?", businessId).
		Where("round.id >= ?", paginationParams.Cursor).
		Order("round.id").
		Limit(paginationParams.Limit).
		Scan(ctx)

	return resp, err
}

func (r *BusinessRepository) GetRoundsByPage(ctx context.Context, businessId int, paginationParams postgres.OffsetPagination) ([]round.Round, int, error) {
	resp := []round.Round{}
	offset := (paginationParams.Page - 1) * paginationParams.PageSize

	count, err := r.db.
		NewSelect().
		Model(&resp).
		Join("JOIN ventures ON ventures.id = round.venture_id").
		Where("ventures.business_id = ?", businessId).
		Order("round.id").
		Offset(offset).
		Limit(paginationParams.PageSize).
		GroupExpr("round.id").
		ScanAndCount(ctx)

	return resp, count, err
}
