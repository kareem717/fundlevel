package venture

import (
	"context"

	"fundlevel/internal/entities/round"
	"fundlevel/internal/storage/postgres/shared"
)

func (r *VentureRepository) GetRegularDynamicRoundsByCursor(ctx context.Context, ventureId int, paginationParams shared.CursorPagination) ([]round.RegularDynamicRound, error) {
	resp := []round.RegularDynamicRound{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Relation("Round").
		Where("round.venture_id = ?", ventureId).
		Where("round.id >= ?", paginationParams.Cursor).
		Order("round.id").
		Limit(paginationParams.Limit).
		Scan(ctx)

	return resp, err
}

func (r *VentureRepository) GetRegularDynamicRoundsByPage(ctx context.Context, ventureId int, paginationParams shared.OffsetPagination) ([]round.RegularDynamicRound, error) {
	resp := []round.RegularDynamicRound{}
	offset := paginationParams.PageSize * (paginationParams.Page - 1)

	err := r.db.
		NewSelect().
		Model(&resp).
		Relation("Round").
		Where("round.venture_id = ?", ventureId).
		Order("round.id").
		Offset(offset).
		Limit(paginationParams.PageSize + 1).
		Scan(ctx)

	return resp, err
}
