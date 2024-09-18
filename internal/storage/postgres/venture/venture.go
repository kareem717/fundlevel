package venture

import (
	"context"
	"database/sql"

	"fundlevel/internal/entities/venture"
	"fundlevel/internal/storage/postgres/shared"

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

	err := r.db.
		NewInsert().
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
		Where("id = ?", id).
		Scan(ctx)

	return resp, err
}

func (r *VentureRepository) GetAll(ctx context.Context, paginationParams shared.PaginationRequest) ([]venture.Venture, error) {
	resp := []venture.Venture{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Where("id >= ?", paginationParams.Cursor).
		Order("id").
		Limit(paginationParams.Limit).
		Scan(ctx)

	return resp, err
}
