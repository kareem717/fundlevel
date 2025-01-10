package analytic

import (
	"context"
	"fundlevel/internal/entities/analytic"
)

func (r *AnalyticRepository) CreateRoundImpression(ctx context.Context, roundId int, accountId int) error {
	_, err := r.db.
		NewInsert().
		Model((*analytic.RoundImpression)(nil)).
		Value("round_id", "?", roundId).
		Value("account_id", "?", accountId).
		Exec(ctx)

	return err
}

func (r *AnalyticRepository) GetRoundImpressionCount(ctx context.Context, roundId int) (int, error) {
	return r.db.
		NewSelect().
		Model(&analytic.RoundImpression{}).
		ModelTableExpr("round_impressions").
		Where("round_id = ?", roundId).
		Count(ctx)
}

func (r *AnalyticRepository) CreateBusinessImpression(ctx context.Context, businessId int, accountId int) error {
	_, err := r.db.
		NewInsert().
		Model((*analytic.BusinessImpression)(nil)).
		Value("business_id", "?", businessId).
		Value("account_id", "?", accountId).
		Exec(ctx)

	return err
}

func (r *AnalyticRepository) GetBusinessImpressionCount(ctx context.Context, businessId int) (int, error) {
	return r.db.
		NewSelect().
		Model(&analytic.BusinessImpression{}).
		ModelTableExpr("business_impressions").
		Where("business_id = ?", businessId).
		Count(ctx)
}
