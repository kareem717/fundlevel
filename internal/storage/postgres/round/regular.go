package round

import (
	"context"
	"database/sql"

	"fundlevel/internal/entities/round"
	"fundlevel/internal/storage/postgres/shared"

	"github.com/uptrace/bun"
)

func (r *RoundRepository) CreateRegularDynamicRound(ctx context.Context, params round.CreateRegularDynamicRoundParams) (round.RegularDynamicRound, error) {
	roundResp := round.Round{}
	regularDynamicRound := round.RegularDynamicRound{}

	err := r.db.RunInTx(ctx, nil, func(ctx context.Context, tx bun.Tx) error {
		err := tx.NewInsert().
			Model(&params.Round).
			ModelTableExpr("rounds").
			Returning("*").
			Scan(ctx, &roundResp)

		if err != nil {
			return err
		}

		params.RegularDynamicRound.RoundID = roundResp.ID

		err = tx.NewInsert().
			Model(&params.RegularDynamicRound).
			ModelTableExpr("regular_dynamic_rounds").
			Returning("*").
			Scan(ctx, &regularDynamicRound)

		return err
	})

	regularDynamicRound.Round = &roundResp

	return regularDynamicRound, err
}

func (r *RoundRepository) DeleteFixedTotalRound(ctx context.Context, id int) error {
	res, err :=
		r.db.
			NewDelete().
			Model(&round.FixedTotalRound{}).
			Where("round_id = ?", id).
			Exec(ctx)

	if rows, _ := res.RowsAffected(); rows == 0 {
		return sql.ErrNoRows
	}

	return err
}

func (r *RoundRepository) GetFixedTotalRoundById(ctx context.Context, id int) (round.FixedTotalRound, error) {
	resp := round.FixedTotalRound{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Relation("Round").
		Where("round_id = ?", id).
		Scan(ctx)

	return resp, err
}

func (r *RoundRepository) GetRegularDynamicRoundsByCursor(ctx context.Context, paginationParams shared.CursorPagination) ([]round.RegularDynamicRound, error) {
	resp := []round.RegularDynamicRound{}

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

func (r *RoundRepository) GetRegularDynamicRoundsByPage(ctx context.Context, paginationParams shared.OffsetPagination) ([]round.RegularDynamicRound, error) {
	resp := []round.RegularDynamicRound{}
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
