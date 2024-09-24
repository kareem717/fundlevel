package round

import (
	"context"
	"database/sql"

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

func (r *RoundRepository) Create(ctx context.Context, params round.CreateRoundParams) (round.Round, error) {
	resp := round.Round{}

	err := r.db.
		NewInsert().
		Model(&params).
		ModelTableExpr("rounds").
		Returning("*").
		Scan(ctx, &resp)

	return resp, err
}

func (r *RoundRepository) Delete(ctx context.Context, id int) error {
	res, err :=
		r.db.
			NewDelete().
			Model(&round.Round{}).
			Where("id = ?", id).
			Where("regular_dynamic_round_id IS NULL").
			Exec(ctx)

	if rows, _ := res.RowsAffected(); rows == 0 {
		return sql.ErrNoRows
	}

	return err
}

func (r *RoundRepository) GetById(ctx context.Context, id int) (round.Round, error) {
	resp := round.Round{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Where("id = ?", id).
		Where("regular_dynamic_round_id IS NULL").
		Scan(ctx)

	return resp, err
}

func (r *RoundRepository) GetMany(ctx context.Context, paginationParams shared.PaginationRequest) ([]round.Round, error) {
	resp := []round.Round{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Where("regular_dynamic_round_id IS NULL").
		Where("id >= ?", paginationParams.Cursor).
		Order("id").
		Limit(paginationParams.Limit).
		Scan(ctx)

	return resp, err
}
