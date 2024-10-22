package business

import (
	"context"

	"fundlevel/internal/entities/round"
	"fundlevel/internal/storage/postgres/helper"
	postgres "fundlevel/internal/storage/shared"
)

func (r *BusinessRepository) GetRoundsByCursor(ctx context.Context, businessId int, paginationParams postgres.CursorPagination, filter round.RoundFilter) ([]round.Round, error) {
	resp := []round.Round{}

	query := r.db.
		NewSelect().
		Model(&resp).
		Join("JOIN ventures ON ventures.id = round.venture_id").
		Where("ventures.business_id = ?", businessId).
		Limit(paginationParams.Limit)

	query = helper.ApplyRoundFilter(query, filter)

	cursorCondition := "round.id >= ?"
	if paginationParams.Cursor > 0 {
		cursorCondition = "round.id <= ?"
	}

	err := query.Where(cursorCondition, paginationParams.Cursor).Scan(ctx, &resp)

	return resp, err
}

func (r *BusinessRepository) GetRoundsByPage(ctx context.Context, businessId int, paginationParams postgres.OffsetPagination, filter round.RoundFilter) ([]round.Round, int, error) {
	resp := []round.Round{}
	offset := (paginationParams.Page - 1) * paginationParams.PageSize

	query := r.db.
		NewSelect().
		Model(&resp).
		Join("JOIN ventures ON ventures.id = round.venture_id").
		Where("ventures.business_id = ?", businessId).
		Offset(offset).
		Limit(paginationParams.PageSize + 1)

	count, err := helper.ApplyRoundFilter(query, filter).ScanAndCount(ctx, &resp)

	return resp, count, err
}
