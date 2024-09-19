package account

import (
	"context"

	"fundlevel/internal/entities/venture"
	"fundlevel/internal/storage/postgres/shared"
)

func (r *AccountRepository) GetVentures(ctx context.Context, accountId int, paginationParams shared.PaginationRequest) ([]venture.Venture, error) {
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
