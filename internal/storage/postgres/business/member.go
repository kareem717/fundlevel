package business

import (
	"context"
	"fundlevel/internal/entities/business"
	postgres "fundlevel/internal/storage/shared"
)

func (r *BusinessRepository) GetBusinessMember(ctx context.Context, businessId int, accountId int) (business.BusinessMemberWithRole, error) {
	resp := business.BusinessMemberWithRole{}
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

func (r *BusinessRepository) GetMembersByPage(ctx context.Context, businessId int, paginationParams postgres.OffsetPagination) ([]business.BusinessMemberWithRoleNameAndAccount, int, error) {
	resp := []business.BusinessMemberWithRoleNameAndAccount{}
	offset := (paginationParams.Page - 1) * paginationParams.PageSize

	query := r.db.
		NewSelect().
		Model(&resp).
		ColumnExpr("business_member.*").
		ColumnExpr("role_table.name as role").
		Join("JOIN business_member_roles as role_table").
		JoinOn("business_member.role_id = role_table.id").
		Relation("Account").
		Where("business_member.business_id = ?", businessId).
		Offset(offset).
		Limit(paginationParams.PageSize + 1)

	count, err := query.ScanAndCount(ctx, &resp)

	return resp, count, err
}
