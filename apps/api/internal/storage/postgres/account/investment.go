package account

import (
	"context"
	"fundlevel/internal/entities/investment"

	"github.com/uptrace/bun"
)

func (r *AccountRepository) GetInvestments(ctx context.Context, accountId, cursor, limit int, filter investment.InvestmentFilter) ([]investment.Investment, error) {
	resp := []investment.Investment{}

	query := r.db.NewSelect().
		Model(&resp).
		Where("investment.investor_id = ?", accountId).
		Limit(limit).
		Where("investment.id >= ?", cursor)

	if filter.Statuses != nil {
		query = query.Where("investment.status IN (?)", bun.In(*filter.Statuses))
	}

	err := query.Scan(ctx, &resp)

	return resp, err
}
