package business

import (
	"context"
	"database/sql"

	"fundlevel/internal/entities/investment"
	"fundlevel/internal/entities/round"
	"fundlevel/internal/storage/postgres/helper"
	postgres "fundlevel/internal/storage/shared"
)

func (r *BusinessRepository) GetInvestmentsByCursor(ctx context.Context, businessId int, paginationParams postgres.CursorPagination, filter investment.InvestmentIntentFilter) ([]investment.InvestmentIntent, error) {
	resp := []investment.InvestmentIntent{}

	query := r.db.
		NewSelect().
		Model(&resp).
		Join("JOIN rounds").
		JoinOn("investment.round_id = rounds.id").
		Where("rounds.business_id = ?", businessId).
		Limit(paginationParams.Limit)

	query = helper.ApplyInvestmentFilter(query, filter)

	cursorCondition := "investment.id >= ?"
	if filter.SortOrder != "asc" && paginationParams.Cursor > 0 {
		cursorCondition = "investment.id <= ?"
	}

	err := query.Where(cursorCondition, paginationParams.Cursor).Scan(ctx, &resp)

	return resp, err
}

func (r *BusinessRepository) GetInvestmentsByPage(ctx context.Context, businessId int, paginationParams postgres.OffsetPagination, filter investment.InvestmentIntentFilter) ([]investment.InvestmentIntent, int, error) {
	resp := []investment.InvestmentIntent{}
	offset := (paginationParams.Page - 1) * paginationParams.PageSize

	query := r.db.
		NewSelect().
		Model(&resp).
		Relation("Round").
		Relation("Investor").
		Where("rounds.business_id = ?", businessId).
		Offset(offset).
		Limit(paginationParams.PageSize + 1)

	count, err := helper.ApplyInvestmentFilter(query, filter).ScanAndCount(ctx, &resp)

	return resp, count, err
}

func (r *BusinessRepository) GetTotalFunding(ctx context.Context, businessId int) (int, error) {
	var totalFunding int

	err := r.db.
		NewSelect().
		Model(&round.Round{}).
		ColumnExpr("SUM(round.percentage_value)").
		Where("round.status = ?", round.RoundStatusSuccessful).
		Where("rounds.business_id = ?", businessId).
		Group("rounds.business_id").
		Scan(ctx, &totalFunding)

	if err != nil {
		if err == sql.ErrNoRows {
			return 0, nil
		}

		return 0, err
	}

	return totalFunding, nil
}
