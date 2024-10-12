package business

import (
	"context"
	"errors"
	"fundlevel/internal/entities/business"

	"github.com/uptrace/bun"
)

type BusinessRepository struct {
	db  bun.IDB
	ctx context.Context
}

func NewBusinessRepository(db bun.IDB, ctx context.Context) *BusinessRepository {
	return &BusinessRepository{db: db, ctx: ctx}
}

func (r *BusinessRepository) Create(ctx context.Context, params business.CreateBusinessParams) (business.Business, error) {
	resp := business.Business{}

	err := r.db.NewInsert().
		Model(&params).
		ModelTableExpr("businesses").
		Returning("*").
		Scan(ctx, &resp)

	return resp, err
}

func (r *BusinessRepository) GetById(ctx context.Context, id int) (business.Business, error) {
	resp := business.Business{}

	err := r.db.NewSelect().
		Model(&resp).
		Where("id = ?", id).
		Scan(ctx)

	return resp, err
}

func (r *BusinessRepository) Delete(ctx context.Context, id int) error {
	resp, err := r.db.NewDelete().
		Model(&business.Business{}).
		Where("id = ?", id).
		Exec(ctx)

	rowsAffected, err := resp.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return errors.New("business not found")
	}

	return err
}
