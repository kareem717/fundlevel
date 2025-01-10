package analytic

import (
	"context"
)

func (s *AnalyticService) CreateRoundImpression(ctx context.Context, roundID int, accountID int) error {
	return s.repositories.Analytic().CreateRoundImpression(ctx, roundID, accountID)
}

func (s *AnalyticService) CreateBusinessImpression(ctx context.Context, businessID int, accountID int) error {
	return s.repositories.Analytic().CreateBusinessImpression(ctx, businessID, accountID)
}

func (s *AnalyticService) GetRoundImpressionCount(ctx context.Context, roundID int) (int, error) {
	return s.repositories.Analytic().GetRoundImpressionCount(ctx, roundID)
}

func (s *AnalyticService) GetBusinessImpressionCount(ctx context.Context, businessID int) (int, error) {
	return s.repositories.Analytic().GetBusinessImpressionCount(ctx, businessID)
}
