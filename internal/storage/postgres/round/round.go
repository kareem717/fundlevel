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

func (r *RoundRepository) GetById(ctx context.Context, id int) (round.RoundWithSubtypes, error) {
	resp := round.RoundWithSubtypes{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Relation("FixedTotalRound").
		Relation("RegularDynamicRound").
		Relation("PartialTotalRound").
		Relation("DutchDynamicRound").
		Where("id = ?", id).
		Scan(ctx)

	return resp, err
}

func (r *RoundRepository) GetByCursor(ctx context.Context, paginationParams shared.CursorPagination) ([]round.RoundWithSubtypes, error) {
	resp := []round.RoundWithSubtypes{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Relation("FixedTotalRound").
		Relation("RegularDynamicRound").
		Relation("PartialTotalRound").
		Relation("DutchDynamicRound").
		Where("id >= ?", paginationParams.Cursor).
		Order("id").
		Limit(paginationParams.Limit).
		Scan(ctx)

	return resp, err
}

func (r *RoundRepository) GetByPage(ctx context.Context, paginationParams shared.OffsetPagination) ([]round.RoundWithSubtypes, error) {
	resp := []round.RoundWithSubtypes{}
	offset := (paginationParams.Page - 1) * paginationParams.PageSize

	err := r.db.
		NewSelect().
		Model(&resp).
		Relation("FixedTotalRound").
		Relation("RegularDynamicRound").
		Relation("PartialTotalRound").
		Relation("DutchDynamicRound").
		Order("id").
		Offset(offset).
		Limit(paginationParams.PageSize + 1).
		Scan(ctx)

	return resp, err
}

func (r *RoundRepository) Delete(ctx context.Context, id int) error {
	res, err :=
		r.db.
			NewDelete().
			Model(&round.Round{}).
			Where("id = ?", id).
			Exec(ctx)

	if rows, _ := res.RowsAffected(); rows == 0 {
		return sql.ErrNoRows
	}

	return err
}
