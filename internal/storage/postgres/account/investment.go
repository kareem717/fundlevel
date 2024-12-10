package account

import (
	"context"

	"fundlevel/internal/entities/investment"
	"fundlevel/internal/storage/postgres/helper"
	postgres "fundlevel/internal/storage/shared"

	"github.com/uptrace/bun"
)

func (r *AccountRepository) GetInvestmentsByCursor(ctx context.Context, accountId int, paginationParams postgres.CursorPagination, filter investment.InvestmentFilter) ([]investment.Investment, error) {
	resp := []investment.Investment{}

	query := r.db.
		NewSelect().
		Model(&resp).
		Relation("Round").
		Where("investment.investor_id = ?", accountId).
		Limit(paginationParams.Limit)

	query = helper.ApplyInvestmentFilter(query, filter)

	cursorCondition := "investment.id >= ?"
	if filter.SortOrder != "asc" && paginationParams.Cursor > 0 {
		cursorCondition = "investment.id <= ?"
	}

	err := query.Where(cursorCondition, paginationParams.Cursor).Scan(ctx, &resp)

	return resp, err
}

func (r *AccountRepository) GetInvestmentsByPage(ctx context.Context, accountId int, paginationParams postgres.OffsetPagination, filter investment.InvestmentFilter) ([]investment.Investment, int, error) {
	resp := []investment.Investment{}
	offset := (paginationParams.Page - 1) * paginationParams.PageSize

	query := r.db.
		NewSelect().
		Model(&resp).
		Relation("Round").
		Where("investment.investor_id = ?", accountId).
		Offset(offset).
		Limit(paginationParams.PageSize + 1)

	count, err := helper.ApplyInvestmentFilter(query, filter).ScanAndCount(ctx, &resp)

	return resp, count, err
}

// TODO: I don't think this logic works anymore
func (r *AccountRepository) IsInvestedInRound(ctx context.Context, accountId int, roundId int) (bool, error) {
	statusArray := []investment.InvestmentStatus{investment.InvestmentStatusTerms, investment.InvestmentStatusPayment}
	stringStatusArray := make([]string, len(statusArray))
	for i, status := range statusArray {
		stringStatusArray[i] = string(status)
	}

	exists, err := r.db.
		NewSelect().
		Model(&investment.Investment{}).
		Where("investment.investor_id = ?", accountId).
		Where("investment.round_id = ?", roundId).
		WhereOr("investment.status IN (?)", bun.In(stringStatusArray)).
		Exists(ctx)

	return exists, err
}

func (r *AccountRepository) GetInvestmentById(ctx context.Context, accountId int, investmentId int) (investment.Investment, error) {
	resp := investment.Investment{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Relation("Round").
		Where("investment.investor_id = ?", accountId).
		Where("investment.id = ?", investmentId).
		Scan(ctx)

	return resp, err
}
