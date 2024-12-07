package business

import (
	"context"
	"fundlevel/internal/entities/business"
)

func (r *BusinessRepository) GetBusinessMember(ctx context.Context, businessId int, accountId int) (business.BusinessMember, error) {
	resp := business.BusinessMember{}
	err := r.db.
		NewSelect().
		Model(&resp).
		Relation("Role").
		Where("business_members.business_id = ?", businessId).
		Where("business_members.account_id = ?", accountId).
		Scan(ctx)

	return resp, err
}
