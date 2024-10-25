package analytic

import (
	"context"

	"fundlevel/internal/entities/analytic"
	"fundlevel/internal/storage"
)

type AnalyticService struct {
	repositories storage.Repository
}

// NewTestService returns a new instance of test service.
func NewAnalyticService(repositories storage.Repository) *AnalyticService {
	return &AnalyticService{
		repositories: repositories,
	}
}

func (s *AnalyticService) GetDailyAggregatedBusinessAnalytics(ctx context.Context, businessId int, minDayOfYear int, maxDayOfYear int) ([]analytic.SimplifiedDailyAggregatedBusinessAnalytics, error) {
	return s.repositories.Analytic().GetDailyAggregatedBusinessAnalytics(ctx, businessId, minDayOfYear, maxDayOfYear)
}

func (s *AnalyticService) GetDailyAggregatedVentureAnalytics(ctx context.Context, ventureId int, minDayOfYear int, maxDayOfYear int) ([]analytic.SimplifiedDailyAggregatedVentureAnalytics, error) {
	return s.repositories.Analytic().GetDailyAggregatedVentureAnalytics(ctx, ventureId, minDayOfYear, maxDayOfYear)
}

func (s *AnalyticService) GetDailyAggregatedRoundAnalytics(ctx context.Context, roundId int, minDayOfYear int, maxDayOfYear int) ([]analytic.SimplifiedDailyAggregatedRoundAnalytics, error) {
	return s.repositories.Analytic().GetDailyAggregatedRoundAnalytics(ctx, roundId, minDayOfYear, maxDayOfYear)
}
