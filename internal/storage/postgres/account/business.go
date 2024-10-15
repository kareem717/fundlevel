package account

import (
	"context"

	"fundlevel/internal/entities/business"
)

func (r *AccountRepository) GetBusinessesByPage(ctx context.Context, accountId int) ([]business.Business, error) {
	resp := []business.Business{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Relation("Address").
		Join("LEFT JOIN business_members ON business.id = business_members.business_id").
		Where("business.owner_account_id = ? ", accountId).
		WhereOr("business_members.account_id = ?", accountId).
		Scan(ctx)

	return resp, err
}
