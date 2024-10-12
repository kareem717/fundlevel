package business

import (
	"context"

	"fundlevel/internal/entities/investment"
	"fundlevel/internal/storage/postgres/shared"
)

func (r *BusinessRepository) GetRecievedRoundInvestmentsByCursor(ctx context.Context, businessId int, paginationParams shared.CursorPagination) ([]investment.RoundInvestment, error) {
	resp := []investment.RoundInvestment{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Relation("Round").
		Join("JOIN ventures").
		JoinOn("round.venture_id = ventures.id").
		Where("ventures.business_id = ?", businessId).
		Where("round_investment.id >= ?", paginationParams.Cursor).
		Order("round_investment.id").
		Limit(paginationParams.Limit).
		Scan(ctx)

	return resp, err
}
