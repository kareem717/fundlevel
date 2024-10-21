package account

import (
	"context"

	"fundlevel/internal/entities/investment"
	"fundlevel/internal/storage/postgres/helper"
	postgres "fundlevel/internal/storage/shared"

	"github.com/uptrace/bun/dialect/pgdialect"
)

func (r *AccountRepository) GetInvestmentsByCursor(ctx context.Context, accountId int, paginationParams postgres.CursorPagination, filter investment.InvestmentFilter) ([]investment.RoundInvestment, error) {
	resp := []investment.RoundInvestment{}

	query := r.db.
		NewSelect().
		Model(&resp).
		Relation("Round").
		Where("round_investment.investor_id = ?", accountId).
		Limit(paginationParams.Limit)

	query = helper.ApplyInvestmentFilter(query, filter)

	cursorCondition := "round_investment.id >= ?"
	if filter.SortOrder != "asc" && paginationParams.Cursor > 0 {
		cursorCondition = "round_investment.id <= ?"
	}

	err := query.Where(cursorCondition, paginationParams.Cursor).Scan(ctx, &resp)

	return resp, err
}

func (r *AccountRepository) GetInvestmentsByPage(ctx context.Context, accountId int, paginationParams postgres.OffsetPagination, filter investment.InvestmentFilter) ([]investment.RoundInvestment, int, error) {
	resp := []investment.RoundInvestment{}
	offset := (paginationParams.Page - 1) * paginationParams.PageSize

	query := r.db.
		NewSelect().
		Model(&resp).
		Relation("Round").
		Where("round_investment.investor_id = ?", accountId).
		Offset(offset).
		Limit(paginationParams.PageSize + 1)

	count, err := helper.ApplyInvestmentFilter(query, filter).ScanAndCount(ctx, &resp)

	return resp, count, err
}

func (r *AccountRepository) IsInvestedInRound(ctx context.Context, accountId int, roundId int) (bool, error) {
	statusArray := []investment.InvestmentStatus{investment.InvestmentStatusAccepted, investment.InvestmentStatusPending}
	stringStatusArray := make([]string, len(statusArray))
	for i, status := range statusArray {
		stringStatusArray[i] = string(status)
	}

	exists, err := r.db.
		NewSelect().
		Model(&investment.RoundInvestment{}).
		Where("round_investment.investor_id = ?", accountId).
		Where("round_investment.round_id = ?", roundId).
		WhereOr("round_investment.status = ANY(?)", pgdialect.Array(stringStatusArray)).
		Exists(ctx)

	return exists, err
}

func (r *AccountRepository) GetInvestmentById(ctx context.Context, accountId int, investmentId int) (investment.RoundInvestment, error) {
	resp := investment.RoundInvestment{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Relation("Round").
		Where("round_investment.investor_id = ?", accountId).
		Where("round_investment.id = ?", investmentId).
		Scan(ctx)

	return resp, err
}
