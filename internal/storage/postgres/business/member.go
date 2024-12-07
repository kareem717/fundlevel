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
		Relation("Role.Permissions").
		Where("business_member.business_id = ?", businessId).
		Where("business_member.account_id = ?", accountId).
		Scan(ctx)

	return resp, err
}
