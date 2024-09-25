package round

import (
	"context"
	"database/sql"
	"fmt"

	"fundlevel/internal/entities/round"
	"fundlevel/internal/storage/postgres/shared"

	"github.com/uptrace/bun"
)

type RoundRepository struct {
	db  bun.IDB
	ctx context.Context
}

// NewRoundRepository returns a new instance of the repository.
func NewRoundRepository(db bun.IDB, ctx context.Context) *RoundRepository {
	return &RoundRepository{
		db:  db,
		ctx: ctx,
	}
}

func (r *RoundRepository) CreateFixedTotalRound(ctx context.Context, params round.CreateFixedTotalRoundParams) (round.FixedTotalRound, error) {
	roundResp := round.Round{}
	fixedTotalRound := round.FixedTotalRound{}

	err := r.db.RunInTx(ctx, nil, func(ctx context.Context, tx bun.Tx) error {
		err := tx.NewInsert().
			Model(&params.Round).
			ModelTableExpr("rounds").
			Returning("*").
			Scan(ctx, &roundResp)

		if err != nil {
			return err
		}

		fmt.Printf("roundResp %+v\n", roundResp)

		params.FixedTotalRound.RoundID = roundResp.ID

		err = tx.NewInsert().
			Model(&params.FixedTotalRound).
			ModelTableExpr("fixed_total_rounds").
			Returning("*").
			Scan(ctx, &fixedTotalRound)

		return err
	})

	fixedTotalRound.Round = &roundResp

	return fixedTotalRound, err
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

	fmt.Printf("resp %+v\n", resp)

	return resp, err
}

func (r *RoundRepository) GetFixedTotalRoundsByCursor(ctx context.Context, paginationParams shared.CursorPagination) ([]round.FixedTotalRound, error) {
	resp := []round.FixedTotalRound{}

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

func (r *RoundRepository) GetFixedTotalRoundsByPage(ctx context.Context, paginationParams shared.OffsetPagination) ([]round.FixedTotalRound, error) {
	resp := []round.FixedTotalRound{}
	offset := (paginationParams.Page - 1) * paginationParams.PageSize

	err := r.db.
		NewSelect().
		Model(&resp).
		Relation("Round").
		Order("round_id").
		Offset(offset).
		Limit(paginationParams.PageSize).
		Scan(ctx)

	return resp, err
}
