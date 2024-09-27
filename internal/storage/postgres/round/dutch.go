package round

import (
	"context"
	"database/sql"

	"fundlevel/internal/entities/round"
	"fundlevel/internal/storage/postgres/shared"

	"github.com/uptrace/bun"
)

func (r *RoundRepository) CreateDutchDynamicRound(ctx context.Context, params round.CreateDutchDynamicRoundParams) (round.DutchDynamicRound, error) {
	roundResp := round.Round{}
	dutchDynamicRound := round.DutchDynamicRound{}

	err := r.db.RunInTx(ctx, nil, func(ctx context.Context, tx bun.Tx) error {
		err := tx.NewInsert().
			Model(&params.Round).
			ModelTableExpr("rounds").
			Returning("*").
			Scan(ctx, &roundResp)

		if err != nil {
			return err
		}

		params.DutchDynamicRound.RoundID = roundResp.ID

		err = tx.NewInsert().
			Model(&params.DutchDynamicRound).
			ModelTableExpr("dutch_dynamic_rounds").
			Returning("*").
			Scan(ctx, &dutchDynamicRound)

		return err
	})

	dutchDynamicRound.Round = &roundResp

	return dutchDynamicRound, err
}

func (r *RoundRepository) DeleteDutchDynamicRound(ctx context.Context, id int) error {
	res, err :=
		r.db.
			NewDelete().
			Model(&round.DutchDynamicRound{}).
			Where("round_id = ?", id).
			Exec(ctx)

	if rows, _ := res.RowsAffected(); rows == 0 {
		return sql.ErrNoRows
	}

	return err
}

func (r *RoundRepository) GetDutchDynamicRoundById(ctx context.Context, id int) (round.DutchDynamicRound, error) {
	resp := round.DutchDynamicRound{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Relation("Round").
		Where("round_id = ?", id).
		Scan(ctx)

	return resp, err
}

func (r *RoundRepository) GetDutchDynamicRoundsByCursor(ctx context.Context, paginationParams shared.CursorPagination) ([]round.DutchDynamicRound, error) {
	resp := []round.DutchDynamicRound{}

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

func (r *RoundRepository) GetDutchDynamicRoundsByPage(ctx context.Context, paginationParams shared.OffsetPagination) ([]round.DutchDynamicRound, error) {
	resp := []round.DutchDynamicRound{}
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
