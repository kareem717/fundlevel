package account

import (
	"context"

	"fundlevel/internal/entities/business"
)

func (r *AccountRepository) GetBusinesses(ctx context.Context, accountId int) ([]business.Business, error) {
	resp := []business.Business{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Relation("Address").
		Where("business.owner_account_id = ? ", accountId).
		Scan(ctx)

	return resp, err
}
