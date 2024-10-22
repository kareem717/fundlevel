package venture

import (
	"context"
	"database/sql"

	"fundlevel/internal/entities/round"
	"fundlevel/internal/entities/venture"
	"fundlevel/internal/storage/postgres/helper"
	postgres "fundlevel/internal/storage/shared"

	"github.com/uptrace/bun"
)

type VentureRepository struct {
	db  bun.IDB
	ctx context.Context
}

// NewVentureRepository returns a new instance of the repository.
func NewVentureRepository(db bun.IDB, ctx context.Context) *VentureRepository {
	return &VentureRepository{
		db:  db,
		ctx: ctx,
	}
}

func (r *VentureRepository) Create(ctx context.Context, params venture.CreateVentureParams) (venture.Venture, error) {
	resp := venture.Venture{}

	err := r.db.NewInsert().
		Model(&params).
		ModelTableExpr("ventures").
		Returning("*").
		Scan(ctx, &resp)

	return resp, err
}

func (r *VentureRepository) Update(ctx context.Context, id int, params venture.UpdateVentureParams) (venture.Venture, error) {
	resp := venture.Venture{}

	err :=
		r.db.
			NewUpdate().
			Model(&params).
			ModelTableExpr("ventures").
			Where("id = ?", id).
			Returning("*").
			OmitZero().
			Scan(ctx, &resp)

	return resp, err
}

func (r *VentureRepository) Delete(ctx context.Context, id int) error {
	res, err :=
		r.db.
			NewDelete().
			Model(&venture.Venture{}).
			Where("id = ?", id).
			Exec(ctx)

	if rows, _ := res.RowsAffected(); rows == 0 {
		return sql.ErrNoRows
	}

	return err
}

func (r *VentureRepository) GetById(ctx context.Context, id int) (venture.Venture, error) {
	resp := venture.Venture{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Relation("Business").
		Where("venture.id = ?", id).
		Scan(ctx)

	return resp, err
}

func (r *VentureRepository) GetByCursor(ctx context.Context, paginationParams postgres.CursorPagination, filter venture.VentureFilter) ([]venture.Venture, error) {
	resp := []venture.Venture{}

	query := r.db.
		NewSelect().
		Model(&resp).
		Relation("Business").
		Relation("Business.Industry").
		Relation("ActiveRound").
		WhereGroup(" OR ", func(q *bun.SelectQuery) *bun.SelectQuery {
			return q.Where("active_round IS NULL").WhereOr("active_round.status = ?", round.Active)
		}).
		Limit(paginationParams.Limit)

	query = helper.ApplyVentureFilter(query, filter)

	cursorCondition := "venture.id >= ?"
	if filter.SortOrder != "asc" && paginationParams.Cursor > 0 {
		cursorCondition = "venture.id <= ?"
	}

	err := query.Where(cursorCondition, paginationParams.Cursor).Scan(ctx, &resp)

	return resp, err
}

func (r *VentureRepository) GetByPage(ctx context.Context, paginationParams postgres.OffsetPagination, filter venture.VentureFilter) ([]venture.Venture, int, error) {
	resp := []venture.Venture{}
	offset := (paginationParams.Page - 1) * paginationParams.PageSize

	query := r.db.
		NewSelect().
		Model(&resp).
		Offset(offset).
		Limit(paginationParams.PageSize + 1)

	query = helper.ApplyVentureFilter(query, filter)

	count, err := query.ScanAndCount(ctx, &resp)

	return resp, count, err
}
