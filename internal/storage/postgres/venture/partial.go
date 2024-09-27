package venture

import (
	"context"

	"fundlevel/internal/entities/round"
	"fundlevel/internal/storage/postgres/shared"
)

func (r *VentureRepository) GetPartialTotalRoundsByCursor(ctx context.Context, ventureId int, paginationParams shared.CursorPagination) ([]round.PartialTotalRound, error) {
	resp := []round.PartialTotalRound{}

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

func (r *VentureRepository) GetPartialTotalRoundsByPage(ctx context.Context, ventureId int, paginationParams shared.OffsetPagination) ([]round.PartialTotalRound, error) {
	resp := []round.PartialTotalRound{}
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
