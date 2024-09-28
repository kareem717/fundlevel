package account

import (
	"context"

	"fundlevel/internal/entities/investment"
	"fundlevel/internal/storage/postgres/shared"
)

func (r *AccountRepository) GetRoundInvestmentsByCursor(ctx context.Context, accountId int, paginationParams shared.CursorPagination) ([]investment.RoundInvestment, error) {
	resp := []investment.RoundInvestment{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Relation("Round").
		Where("round_investment.investor_id = ?", accountId).
		Where("round_investment.id >= ?", paginationParams.Cursor).
		Order("round_investment.id").
		Limit(paginationParams.Limit).
		Scan(ctx)

	return resp, err
}

func (r *AccountRepository) GetRoundInvestmentsByPage(ctx context.Context, accountId int, paginationParams shared.OffsetPagination) ([]investment.RoundInvestment, error) {
	resp := []investment.RoundInvestment{}
	offset := (paginationParams.Page - 1) * paginationParams.PageSize

	err := r.db.
		NewSelect().
		Model(&resp).
		Relation("Round").
		Where("round_investment.investor_id = ?", accountId).
		Order("round_investment.id").
		Offset(offset).
		Limit(paginationParams.PageSize + 1).
		Scan(ctx)

	return resp, err
}
