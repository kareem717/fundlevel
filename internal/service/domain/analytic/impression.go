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

func (s *AnalyticService) CreateRoundImpression(ctx context.Context, params analytic.CreateRoundImpressionParams) error {
	return s.repositories.Impression().CreateRoundImpression(ctx, params)
}

func (s *AnalyticService) CreateVentureImpression(ctx context.Context, params analytic.CreateVentureImpressionParams) error {
	return s.repositories.Impression().CreateVentureImpression(ctx, params)
}

func (s *AnalyticService) CreateBusinessImpression(ctx context.Context, params analytic.CreateBusinessImpressionParams) error {
	return s.repositories.Impression().CreateBusinessImpression(ctx, params)
}

func (s *AnalyticService) GetRoundImpressionCount(ctx context.Context, roundID int) (int, error) {
	return s.repositories.Impression().GetRoundImpressionCount(ctx, roundID)
}

func (s *AnalyticService) GetVentureImpressionCount(ctx context.Context, ventureID int) (int, error) {
	return s.repositories.Impression().GetVentureImpressionCount(ctx, ventureID)
}

func (s *AnalyticService) GetBusinessImpressionCount(ctx context.Context, businessID int) (int, error) {
	return s.repositories.Impression().GetBusinessImpressionCount(ctx, businessID)
}
