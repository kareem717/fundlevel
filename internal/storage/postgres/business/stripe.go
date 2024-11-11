package business

import (
	"context"
	"errors"
	"fundlevel/internal/entities/business"
	// "github.com/uptrace/bun"
)

func (r *BusinessRepository) GetStripeAccountByAccountId(ctx context.Context, accountId string) (business.BusinessStripeAccount, error) {
	resp := business.BusinessStripeAccount{}

	err := r.db.NewSelect().
		Model(&resp).
		Where("stripe_connected_account_id = ?", accountId).
		Scan(ctx)

	return resp, err
}

func (r *BusinessRepository) UpdateStripeAccount(ctx context.Context, id int, params business.UpdateBusinessStripeAccountParams) (business.BusinessStripeAccount, error) {
	resp := business.BusinessStripeAccount{}

	err := r.db.NewUpdate().
		Model(&params).
		ModelTableExpr("business_stripe_accounts").
		Where("business_id = ?", id).
		Returning("*").
		OmitZero().
		Scan(ctx, &resp)

	return resp, err
}

func (r *BusinessRepository) GetStripeAccount(ctx context.Context, businessId int) (business.BusinessStripeAccount, error) {
	resp := business.BusinessStripeAccount{}

	err := r.db.NewSelect().
		Model(&resp).
		Where("business_id = ?", businessId).
		Scan(ctx)

	return resp, err
}

func (r *BusinessRepository) DeleteStripeAccount(ctx context.Context, id int) error {
	resp, err := r.db.NewDelete().
		Model(&business.BusinessStripeAccount{}).
		Where("business_id = ?", id).
		Exec(ctx)

	rowsAffected, err := resp.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return errors.New("no rows affected")
	}

	return nil
}
