package venture

import (
	"context"
	"database/sql"

	"fundlevel/internal/entities/address"
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
	address := address.Address{}
	resp := venture.Venture{}

	err := r.db.RunInTx(ctx, nil, func(ctx context.Context, tx bun.Tx) error {
		err := tx.NewInsert().
			Model(&params.Address).
			ModelTableExpr("addresses").
			Returning("*").
			Scan(ctx, &address)

		params.Venture.AddressID = address.ID
		err = tx.NewInsert().
			Model(&params.Venture).
			ModelTableExpr("ventures").
			Returning("*").
			Scan(ctx, &resp)
		if err != nil {
			return err
		}

		return nil
	})
	if err != nil {
		return resp, err
	}

	resp.Address = &address

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
		Relation("Address").
		Where("id = ?", id).
		Scan(ctx)

	return resp, err
}

func (r *VentureRepository) GetManyByCursor(ctx context.Context, paginationParams shared.CursorPagination) ([]venture.Venture, error) {
	resp := []venture.Venture{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Relation("Address").
		Where("id >= ?", paginationParams.Cursor).
		Order("id").
		Limit(paginationParams.Limit).
		Scan(ctx)

	return resp, err
}

func (r *VentureRepository) GetManyByPage(ctx context.Context, paginationParams shared.OffsetPagination) ([]venture.Venture, error) {
	resp := []venture.Venture{}
	offset := (paginationParams.Page - 1) * paginationParams.PageSize

	err := r.db.
		NewSelect().
		Model(&resp).
		Relation("Address").
		Order("id").
		Offset(offset).
		Limit(paginationParams.PageSize + 1).
		Scan(ctx)

	return resp, err
}
