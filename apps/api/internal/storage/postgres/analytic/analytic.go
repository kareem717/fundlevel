package analytic

import (
	"context"
	"fundlevel/internal/entities/analytic"

	"github.com/uptrace/bun"
)

type AnalyticRepository struct {
	db  bun.IDB
	ctx context.Context
}

func NewAnalyticRepository(db bun.IDB, ctx context.Context) *AnalyticRepository {
	return &AnalyticRepository{
		db:  db,
		ctx: ctx,
	}
}

func (r *AnalyticRepository) GetDailyAggregatedBusinessAnalytics(ctx context.Context, businessId int, minDayOfYear int, maxDayOfYear int) ([]analytic.SimplifiedDailyAggregatedBusinessAnalytics, error) {
	result := []analytic.SimplifiedDailyAggregatedBusinessAnalytics{}

	err := r.db.
		NewSelect().
		Model(&result).
		Where("business_id = ?", businessId).
		Where("day_of_year >= ?", minDayOfYear).
		Where("day_of_year <= ?", maxDayOfYear).
		Scan(ctx)

	return result, err
}

func (r *AnalyticRepository) GetDailyAggregatedRoundAnalytics(ctx context.Context, roundId int, minDayOfYear int, maxDayOfYear int) ([]analytic.SimplifiedDailyAggregatedRoundAnalytics, error) {
	result := []analytic.SimplifiedDailyAggregatedRoundAnalytics{}

	err := r.db.
		NewSelect().
		Model(&result).
		Where("round_id = ?", roundId).
		Where("day_of_year >= ?", minDayOfYear).
		Where("day_of_year <= ?", maxDayOfYear).
		Scan(ctx)

	return result, err
}
