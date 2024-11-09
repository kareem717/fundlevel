package business

import (
	"context"
	"database/sql"

	"fundlevel/internal/entities/investment"
	"fundlevel/internal/entities/round"
	"fundlevel/internal/storage/postgres/helper"
	postgres "fundlevel/internal/storage/shared"
)

func (r *BusinessRepository) GetInvestmentsByCursor(ctx context.Context, businessId int, paginationParams postgres.CursorPagination, filter investment.InvestmentFilter) ([]investment.RoundInvestment, error) {
	resp := []investment.RoundInvestment{}

	query := r.db.
		NewSelect().
		Model(&resp).
		Join("JOIN rounds").
		JoinOn("round_investment.round_id = rounds.id").
		Join("JOIN ventures").
		JoinOn("rounds.venture_id = ventures.id").
		Where("ventures.business_id = ?", businessId).
		Limit(paginationParams.Limit)

	query = helper.ApplyInvestmentFilter(query, filter)

	cursorCondition := "round_investment.id >= ?"
	if filter.SortOrder != "asc" && paginationParams.Cursor > 0 {
		cursorCondition = "round_investment.id <= ?"
	}

	err := query.Where(cursorCondition, paginationParams.Cursor).Scan(ctx, &resp)

	return resp, err
}

func (r *BusinessRepository) GetInvestmentsByPage(ctx context.Context, businessId int, paginationParams postgres.OffsetPagination, filter investment.InvestmentFilter) ([]investment.RoundInvestment, int, error) {
	resp := []investment.RoundInvestment{}
	offset := (paginationParams.Page - 1) * paginationParams.PageSize

	query := r.db.
		NewSelect().
		Model(&resp).
		Relation("Round").
		Relation("Investor").
		Join("JOIN ventures").
		JoinOn("round.venture_id = ventures.id").
		Where("ventures.business_id = ?", businessId).
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
		Join("JOIN ventures").
		JoinOn("round.venture_id = ventures.id").
		Where("round.status = ?", round.RoundStatusSuccessful).
		Where("ventures.business_id = ?", businessId).
		Group("ventures.business_id").
		Scan(ctx, &totalFunding)

	if err != nil {
		if err == sql.ErrNoRows {
			return 0, nil
		}

		return 0, err
	}

	return totalFunding, nil
}
