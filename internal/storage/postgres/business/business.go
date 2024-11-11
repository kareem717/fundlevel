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
	resp := business.Business{}
	var address address.Address
	var stripeAccount business.BusinessStripeAccount

	err := r.db.RunInTx(ctx, nil, func(ctx context.Context, tx bun.Tx) error {
		err := tx.NewInsert().
			Model(&params.Address).
			ModelTableExpr("addresses").
			Returning("*").
			Scan(ctx, &address)
		if err != nil {
			return err
		}

		resp.Address = &address

		params.Business.AddressID = address.ID
		err = tx.NewInsert().
			Model(&params.Business).
			ModelTableExpr("businesses").
			Returning("*").
			Scan(ctx, &resp)
		if err != nil {
			return err
		}

		params.StripeAccount.BusinessID = resp.ID
		err = tx.NewInsert().
			Model(&params.StripeAccount).
			ModelTableExpr("business_stripe_accounts").
			Returning("*").
			Scan(ctx, &stripeAccount)
		if err != nil {
			return err
		}

		resp.StripeAccount = &stripeAccount
		return nil
	})
	if err != nil {
		return resp, err
	}

	return resp, nil
}

func (r *BusinessRepository) GetById(ctx context.Context, id int) (business.Business, error) {
	resp := business.Business{}

	err := r.db.NewSelect().
		Model(&resp).
		Relation("Address").
		Relation("StripeAccount").
		Relation("Industry").
		Where("business.id = ?", id).
		Scan(ctx)

	return resp, err
}

func (r *BusinessRepository) Delete(ctx context.Context, id int) error {
	resp, err := r.db.NewDelete().
		Model(&business.Business{}).
		Where("id = ?", id).
		Exec(ctx)
	if err != nil {
		return err
	}

	rowsAffected, err := resp.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return errors.New("business not found")
	}

	return err
}

func (r *BusinessRepository) GetByStripeConnectedAccountId(ctx context.Context, stripeConnectedAccountId string) (business.Business, error) {
	resp := business.Business{}

	err := r.db.NewSelect().
		Model(&resp).
		Where("stripe_connected_account_id = ?", stripeConnectedAccountId).
		Scan(ctx)

	return resp, err
}

func (r *BusinessRepository) Update(ctx context.Context, id int, params business.UpdateBusinessParams) (business.Business, error) {
	resp := business.Business{}

	err :=
		r.db.
			NewUpdate().
			Model(&params).
			ModelTableExpr("businesses").
			Where("id = ?", id).
			Returning("*").
			OmitZero().
			Scan(ctx, &resp)

	return resp, err
}
