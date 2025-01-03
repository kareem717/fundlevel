package account

import (
	"context"

	"fundlevel/internal/entities/business"
)

func (r *AccountRepository) GetAllBusinesses(ctx context.Context, accountId int) ([]business.Business, error) {
	resp := []business.Business{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Join("JOIN business_members").
		JoinOn("business_members.business_id = business.id AND business_members.account_id = ?", accountId).
		Scan(ctx)

	return resp, err
}
