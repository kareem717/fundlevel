package round

import (
	"context"
	"database/sql"

	"fundlevel/internal/entities/round"
	"fundlevel/internal/storage/postgres/shared"

	"github.com/uptrace/bun"
)

func (r *RoundRepository) CreatePartialTotalRound(ctx context.Context, params round.CreatePartialTotalRoundParams) (round.PartialTotalRound, error) {
	roundResp := round.Round{}
	partialTotalRound := round.PartialTotalRound{}

	err := r.db.RunInTx(ctx, nil, func(ctx context.Context, tx bun.Tx) error {
		err := tx.NewInsert().
			Model(&params.Round).
			ModelTableExpr("rounds").
			Returning("*").
			Scan(ctx, &roundResp)

		if err != nil {
			return err
		}

		params.PartialTotalRound.RoundID = roundResp.ID

		err = tx.NewInsert().
			Model(&params.PartialTotalRound).
			ModelTableExpr("partial_total_rounds").
			Returning("*").
			Scan(ctx, &partialTotalRound)

		return err
	})

	partialTotalRound.Round = &roundResp

	return partialTotalRound, err
}

func (r *RoundRepository) DeletePartialTotalRound(ctx context.Context, id int) error {
	res, err :=
		r.db.
			NewDelete().
			Model(&round.PartialTotalRound{}).
			Where("round_id = ?", id).
			Exec(ctx)

	if rows, _ := res.RowsAffected(); rows == 0 {
		return sql.ErrNoRows
	}

	return err
}

func (r *RoundRepository) GetPartialTotalRoundById(ctx context.Context, id int) (round.PartialTotalRound, error) {
	resp := round.PartialTotalRound{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Relation("Round").
		Where("round_id = ?", id).
		Scan(ctx)

	return resp, err
}

func (r *RoundRepository) GetPartialTotalRoundsByCursor(ctx context.Context, paginationParams shared.CursorPagination) ([]round.PartialTotalRound, error) {
	resp := []round.PartialTotalRound{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Relation("Round").
		Where("round_id >= ?", paginationParams.Cursor).
		Order("round_id").
		Limit(paginationParams.Limit).
		Scan(ctx)

	return resp, err
}

func (r *RoundRepository) GetPartialTotalRoundsByPage(ctx context.Context, paginationParams shared.OffsetPagination) ([]round.PartialTotalRound, error) {
	resp := []round.PartialTotalRound{}
	offset := (paginationParams.Page - 1) * paginationParams.PageSize

	err := r.db.
		NewSelect().
		Model(&resp).
		Relation("Round").
		Order("round_id").
		Offset(offset).
		Limit(paginationParams.PageSize + 1).
		Scan(ctx)

	return resp, err
}
