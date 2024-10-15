package business

import (
	"context"
	"errors"
	"fundlevel/internal/entities/address"
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
	address := address.Address{}
	resp := business.Business{}

	err := r.db.RunInTx(ctx, nil, func(ctx context.Context, tx bun.Tx) error {
		err := tx.NewInsert().
			Model(&params.Address).
			ModelTableExpr("addresses").
			Returning("*").
			Scan(ctx, &address)

		params.Business.AddressID = address.ID
		err = tx.NewInsert().
			Model(&params.Business).
			ModelTableExpr("businesses").
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

	return resp, nil
}

func (r *BusinessRepository) GetById(ctx context.Context, id int) (business.Business, error) {
	resp := business.Business{}

	err := r.db.NewSelect().
		Model(&resp).
		Relation("Address").
		Where("business.id = ?", id).
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
