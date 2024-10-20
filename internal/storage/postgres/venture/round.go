package venture

import (
	"context"

	"fundlevel/internal/entities/round"
	"fundlevel/internal/storage/postgres/helper"
	postgres "fundlevel/internal/storage/shared"
)

func (r *VentureRepository) GetRoundsByCursor(ctx context.Context, ventureId int, paginationParams postgres.CursorPagination, filter round.RoundFilter) ([]round.Round, error) {
	resp := []round.Round{}

	query := r.db.
		NewSelect().
		Model(&resp).
		Where("round.venture_id = ?", ventureId).
		Limit(paginationParams.Limit)

	query = helper.ApplyRoundFilter(query, filter)

	cursorCondition := "round.id >= ?"
	if filter.SortOrder != "asc" && paginationParams.Cursor > 0 {
		cursorCondition = "round.id <= ?"
	}

	err := query.Where(cursorCondition, paginationParams.Cursor).Scan(ctx, &resp)

	return resp, err
}

func (r *VentureRepository) GetRoundsByPage(ctx context.Context, ventureId int, paginationParams postgres.OffsetPagination, filter round.RoundFilter) ([]round.Round, int, error) {
	resp := []round.Round{}
	offset := paginationParams.PageSize * (paginationParams.Page - 1)

	query := r.db.
		NewSelect().
		Model(&resp).
		Where("round.venture_id = ?", ventureId).
		Order("round.id").
		Offset(offset).
		Limit(paginationParams.PageSize + 1)

	count, err := helper.ApplyRoundFilter(query, filter).ScanAndCount(ctx, &resp)

	return resp, count, err
}

func (r *VentureRepository) HasActiveRound(ctx context.Context, ventureId int) (bool, error) {
	return r.db.
		NewSelect().
		Model(&round.Round{}).
		Where("round.venture_id = ?", ventureId).
		Where("round.status = ?", "active").
		Exists(ctx)
}

func (r *VentureRepository) GetActiveRound(ctx context.Context, ventureId int) (round.Round, error) {
	resp := round.Round{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Where("round.venture_id = ?", ventureId).
		Where("round.status = ?", "active").
		Scan(ctx)

	return resp, err
}
