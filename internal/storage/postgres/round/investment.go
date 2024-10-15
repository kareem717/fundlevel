package round

import (
	"context"

	"fundlevel/internal/entities/investment"
	"fundlevel/internal/storage/postgres/shared"
)

func (r *RoundRepository) GetInvestmentsByCursor(ctx context.Context, roundId int, paginationParams shared.CursorPagination) ([]investment.RoundInvestment, error) {
	resp := []investment.RoundInvestment{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Relation("Investor").
		Where("round_investment.round_id = ?", roundId).
		Where("round_investment.id >= ?", paginationParams.Cursor).
		Order("round_investment.id").
		Limit(paginationParams.Limit).
		Scan(ctx)

	return resp, err
}

func (r *RoundRepository) GetInvestmentsByPage(ctx context.Context, roundId int, paginationParams shared.OffsetPagination) ([]investment.RoundInvestment, error) {
	resp := []investment.RoundInvestment{}
	offset := (paginationParams.Page - 1) * paginationParams.PageSize

	err := r.db.
		NewSelect().
		Model(&resp).
		Relation("Investor").
		Where("round_investment.round_id = ?", roundId).
		Order("round_investment.id").
		Offset(offset).
		Limit(paginationParams.PageSize + 1).
		Scan(ctx)

	return resp, err
}
