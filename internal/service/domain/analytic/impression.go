package analytic

import (
	"context"

	"fundlevel/internal/entities/analytic"
)

func (s *AnalyticService) CreateRoundImpression(ctx context.Context, params analytic.CreateRoundImpressionParams) error {
	return s.repositories.Analytic().CreateRoundImpression(ctx, params)
}

func (s *AnalyticService) CreateVentureImpression(ctx context.Context, params analytic.CreateVentureImpressionParams) error {
	return s.repositories.Analytic().CreateVentureImpression(ctx, params)
}

func (s *AnalyticService) CreateBusinessImpression(ctx context.Context, params analytic.CreateBusinessImpressionParams) error {
	return s.repositories.Analytic().CreateBusinessImpression(ctx, params)
}

func (s *AnalyticService) GetRoundImpressionCount(ctx context.Context, roundID int) (int, error) {
	return s.repositories.Analytic().GetRoundImpressionCount(ctx, roundID)
}

func (s *AnalyticService) GetVentureImpressionCount(ctx context.Context, ventureID int) (int, error) {
	return s.repositories.Analytic().GetVentureImpressionCount(ctx, ventureID)
}

func (s *AnalyticService) GetBusinessImpressionCount(ctx context.Context, businessID int) (int, error) {
	return s.repositories.Analytic().GetBusinessImpressionCount(ctx, businessID)
}
