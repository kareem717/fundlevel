package account

import (
	"context"

	"fundlevel/internal/entities/venture"
	"fundlevel/internal/storage/postgres/shared"
)

func (r *AccountRepository) GetVenturesByCursor(ctx context.Context, accountId int, paginationParams shared.CursorPagination) ([]venture.Venture, error) {
	resp := []venture.Venture{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Where("owner_account_id = ?", accountId).
		Where("id >= ?", paginationParams.Cursor).
		Order("id").
		Limit(paginationParams.Limit).
		Scan(ctx)

	return resp, err
}

func (r *AccountRepository) GetVenturesByPage(ctx context.Context, accountId int, paginationParams shared.OffsetPagination) ([]venture.Venture, error) {
	resp := []venture.Venture{}
	offset := (paginationParams.Page - 1) * paginationParams.PageSize

	err := r.db.
		NewSelect().
		Model(&resp).
		Where("owner_account_id = ?", accountId).
		Order("id").
		Offset(offset).
		Limit(paginationParams.PageSize).
		Scan(ctx)

	return resp, err
}
