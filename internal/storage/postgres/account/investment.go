package account

import (
	"context"

	"fundlevel/internal/entities/investment"
	"fundlevel/internal/storage/postgres/shared"

	"github.com/uptrace/bun/dialect/pgdialect"
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

func (r *AccountRepository) GetRecievedRoundInvestmentsByCursor(ctx context.Context, accountId int, paginationParams shared.CursorPagination) ([]investment.RoundInvestment, error) {
	resp := []investment.RoundInvestment{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Relation("Round").
		Join("JOIN ventures").
		JoinOn("round.venture_id = ventures.id").
		Where("ventures.owner_account_id = ?", accountId).
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

func (r *AccountRepository) IsInvestedInRound(ctx context.Context, accountId int, roundId int) (bool, error) {
	statusArray := []investment.InvestmentStatus{investment.InvestmentStatusAccepted, investment.InvestmentStatusPending}
	stringStatusArray := make([]string, len(statusArray))
	for i, status := range statusArray {
		stringStatusArray[i] = string(status)
	}

	exists, err  := r.db.
		NewSelect().
		Model(&investment.RoundInvestment{}).
		Where("round_investment.investor_id = ?", accountId).
		Where("round_investment.round_id = ?", roundId).
		WhereOr("round_investment.status = ANY(?)", pgdialect.Array(stringStatusArray)).
		Exists(ctx)

	return exists, err
}
