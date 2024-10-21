package venture

import (
	"context"

	"fundlevel/internal/entities/investment"
	"fundlevel/internal/storage/postgres/helper"
	postgres "fundlevel/internal/storage/shared"
)

func (r *VentureRepository) GetInvestmentsByCursor(ctx context.Context, ventureId int, paginationParams postgres.CursorPagination, filter investment.InvestmentFilter) ([]investment.RoundInvestment, error) {
	resp := []investment.RoundInvestment{}

	query := r.db.
		NewSelect().
		Model(&resp).
		Relation("Investor").
		Relation("Round").
		Where("round.venture_id = ?", ventureId).
		Limit(paginationParams.Limit)

	query = helper.ApplyInvestmentFilter(query, filter)

	cursorCondition := "round_investment.id >= ?"
	if filter.SortOrder != "asc" && paginationParams.Cursor > 0 {
		cursorCondition = "round_investment.id <= ?"
	}

	err := query.Where(cursorCondition, paginationParams.Cursor).Scan(ctx, &resp)

	return resp, err
}

func (r *VentureRepository) GetInvestmentsByPage(ctx context.Context, ventureId int, paginationParams postgres.OffsetPagination, filter investment.InvestmentFilter) ([]investment.RoundInvestment, int, error) {
	resp := []investment.RoundInvestment{}
	offset := (paginationParams.Page - 1) * paginationParams.PageSize

	query := r.db.
		NewSelect().
		Model(&resp).
		Relation("Investor").
		Relation("Round").
		Where("round.venture_id = ?", ventureId).
		Offset(offset).
		Limit(paginationParams.PageSize + 1)
	
	count, err := helper.ApplyInvestmentFilter(query, filter).ScanAndCount(ctx, &resp)

	return resp, count, err
}
