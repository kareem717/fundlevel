package round

import (
	"context"

	"fundlevel/internal/entities/investment"
	"fundlevel/internal/storage/postgres/helper"
	postgres "fundlevel/internal/storage/shared"
)

func (r *RoundRepository) GetInvestmentsByCursor(ctx context.Context, roundId int, paginationParams postgres.CursorPagination, filter investment.InvestmentFilter) ([]investment.Investment, error) {
	resp := []investment.Investment{}

	query := r.db.
		NewSelect().
		Model(&resp).
		Relation("Investor").
		Where("investment.round_id = ?", roundId).
		Limit(paginationParams.Limit)

	query = helper.ApplyInvestmentFilter(query, filter)

	cursorCondition := "investment.id >= ?"
	if filter.SortOrder != "asc" && paginationParams.Cursor > 0 {
		cursorCondition = "investment.id <= ?"
	}

	err := query.Where(cursorCondition, paginationParams.Cursor).Scan(ctx, &resp)

	return resp, err
}

func (r *RoundRepository) GetInvestmentsByPage(ctx context.Context, roundId int, paginationParams postgres.OffsetPagination, filter investment.InvestmentFilter) ([]investment.Investment, int, error) {
	resp := []investment.Investment{}
	offset := (paginationParams.Page - 1) * paginationParams.PageSize

	query := r.db.
		NewSelect().
		Model(&resp).
		Relation("Investor").
		Where("investment.round_id = ?", roundId).
		Offset(offset).
		Limit(paginationParams.PageSize + 1)

	count, err := helper.ApplyInvestmentFilter(query, filter).ScanAndCount(ctx, &resp)

	return resp, count, err
}
