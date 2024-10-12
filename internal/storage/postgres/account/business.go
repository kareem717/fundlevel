package account

import (
	"context"

	"fundlevel/internal/entities/business"
	"fundlevel/internal/storage/postgres/shared"
)

func (r *AccountRepository) GetBusinessesByPage(ctx context.Context, accountId int, paginationParams shared.OffsetPagination) ([]business.Business, error) {
	resp := []business.Business{}
	offset := (paginationParams.Page - 1) * paginationParams.PageSize

	err := r.db.
		NewSelect().
		Model(&resp).
		Relation("Address").
		Join("LEFT JOIN business_members ON business.id = business_members.business_id").
		Where("business.owner_account_id = ? ", accountId).
		WhereOr("business_members.account_id = ?", accountId).
		Order("business.id").
		Offset(offset).
		Limit(paginationParams.PageSize + 1).
		Scan(ctx)

	return resp, err
}
