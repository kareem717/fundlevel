package business

import (
	"context"
	"database/sql"

	"fundlevel/internal/entities/investment"
	"fundlevel/internal/entities/round"
	postgres "fundlevel/internal/storage/shared"
)

func (r *BusinessRepository) GetInvestmentsByCursor(ctx context.Context, businessId int, paginationParams postgres.CursorPagination) ([]investment.RoundInvestment, error) {
	resp := []investment.RoundInvestment{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Join("JOIN ventures").
		JoinOn("round.venture_id = ventures.id").
		Where("ventures.business_id = ?", businessId).
		Where("round_investment.id >= ?", paginationParams.Cursor).
		Order("round_investment.id").
		Limit(paginationParams.Limit).
		Scan(ctx)

	return resp, err
}

func (r *BusinessRepository) GetInvestmentsByPage(ctx context.Context, businessId int, paginationParams postgres.OffsetPagination) ([]investment.RoundInvestment, error) {
	resp := []investment.RoundInvestment{}
	offset := (paginationParams.Page - 1) * paginationParams.PageSize

	err := r.db.
		NewSelect().
		Model(&resp).
		Join("JOIN ventures").
		JoinOn("round.venture_id = ventures.id").
		Where("ventures.business_id = ?", businessId).
		Order("round_investment.id").
		Offset(offset).
		Limit(paginationParams.PageSize).
		Scan(ctx)

	return resp, err
}

func (r *BusinessRepository) GetTotalFunding(ctx context.Context, businessId int) (int, error) {
	var totalFunding int

	err := r.db.
		NewSelect().
		Model(&round.Round{}).
		ColumnExpr("SUM(round.percentage_value)").
		Join("JOIN ventures").
		JoinOn("round.venture_id = ventures.id").
		Where("round.status = ?", round.Successful).
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
