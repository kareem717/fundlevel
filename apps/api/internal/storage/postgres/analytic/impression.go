package analytic

import (
	"context"
	"fundlevel/internal/entities/analytic"
)

func (r *AnalyticRepository) CreateRoundImpression(ctx context.Context, params analytic.CreateRoundImpressionParams) error {
	_, err := r.db.
		NewInsert().
		Model(&params).
		ModelTableExpr("round_impressions").
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

func (r *AnalyticRepository) CreateBusinessImpression(ctx context.Context, params analytic.CreateBusinessImpressionParams) error {
	_, err := r.db.
		NewInsert().
		Model(&params).
		ModelTableExpr("business_impressions").
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
