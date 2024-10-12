package business

import (
	"context"
	"errors"

	"fundlevel/internal/entities/business"
	"fundlevel/internal/storage/postgres/shared"
)

func (r *BusinessRepository) CreateMember(ctx context.Context, params business.CreateBusinessMemberParams) (business.BusinessMember, error) {
	resp := business.BusinessMember{}

	err := r.db.NewInsert().
		Model(&params).
		ModelTableExpr("business_members").
		Returning("*").
		Scan(ctx, &resp)

	return resp, err
}

func (r *BusinessRepository) DeleteMember(ctx context.Context, businessId int, accountId int) error {
	resp, err := r.db.NewDelete().
		Model(&business.BusinessMember{}).
		Where("business_id = ? AND account_id = ?", businessId, accountId).
		Exec(ctx)

	rowsAffected, err := resp.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return errors.New("business member not found")
	}

	return err
}

func (r *BusinessRepository) UpdateMember(ctx context.Context, businessId int, accountId int, params business.UpdateBusinessMemberParams) (business.BusinessMember, error) {
	resp := business.BusinessMember{}

	err := r.db.NewUpdate().
		Model(&params).
		ModelTableExpr("business_members").
		Where("business_id = ? AND account_id = ?", businessId, accountId).
		Returning("*").
		Scan(ctx, &resp)

	return resp, err
}

func (r *BusinessRepository) GetMembersByPage(ctx context.Context, businessId int, paginationParams shared.OffsetPagination) ([]business.BusinessMember, error) {
	resp := []business.BusinessMember{}
	offset := (paginationParams.Page - 1) * paginationParams.PageSize

	err := r.db.
		NewSelect().
		Model(&resp).
		Where("business_id = ?", businessId).
		OrderExpr("(business_id, account_id)").
		Offset(offset).
		Limit(paginationParams.PageSize + 1).
		Scan(ctx)

	return resp, err
}
