package analytic

import (
	"context"

	entities "fundlevel/internal/entities/analytic"
)

func (s *AnalyticService) GetRoundFavouriteCount(ctx context.Context, roundID int) (int, error) {
	return s.repositories.Analytic().GetRoundFavouriteCount(ctx, roundID)
}

func (s *AnalyticService) GetVentureFavouriteCount(ctx context.Context, ventureID int) (int, error) {
	return s.repositories.Analytic().GetVentureFavouriteCount(ctx, ventureID)
}

func (s *AnalyticService) GetBusinessFavouriteCount(ctx context.Context, businessID int) (int, error) {
	return s.repositories.Analytic().GetBusinessFavouriteCount(ctx, businessID)
}

func (s *AnalyticService) IsRoundFavouritedByAccount(ctx context.Context, roundID int, accountID int) (bool, error) {
	return s.repositories.Analytic().IsRoundFavouritedByAccount(ctx, roundID, accountID)
}

func (s *AnalyticService) IsVentureFavouritedByAccount(ctx context.Context, ventureID int, accountID int) (bool, error) {
	return s.repositories.Analytic().IsVentureFavouritedByAccount(ctx, ventureID, accountID)
}

func (s *AnalyticService) IsBusinessFavouritedByAccount(ctx context.Context, businessID int, accountID int) (bool, error) {
	return s.repositories.Analytic().IsBusinessFavouritedByAccount(ctx, businessID, accountID)
}

func (s *AnalyticService) CreateRoundFavourite(ctx context.Context, params entities.CreateRoundFavouriteParams) error {
	return s.repositories.Analytic().CreateRoundFavourite(ctx, params)
}

func (s *AnalyticService) DeleteRoundFavourite(ctx context.Context, roundID int, accountID int) error {
	return s.repositories.Analytic().DeleteRoundFavourite(ctx, roundID, accountID)
}

func (s *AnalyticService) CreateVentureFavourite(ctx context.Context, params entities.CreateVentureFavouriteParams) error {
	return s.repositories.Analytic().CreateVentureFavourite(ctx, params)
}

func (s *AnalyticService) DeleteVentureFavourite(ctx context.Context, ventureID int, accountID int) error {
	return s.repositories.Analytic().DeleteVentureFavourite(ctx, ventureID, accountID)
}

func (s *AnalyticService) CreateBusinessFavourite(ctx context.Context, params entities.CreateBusinessFavouriteParams) error {
	return s.repositories.Analytic().CreateBusinessFavourite(ctx, params)
}

func (s *AnalyticService) DeleteBusinessFavourite(ctx context.Context, businessID int, accountID int) error {
	return s.repositories.Analytic().DeleteBusinessFavourite(ctx, businessID, accountID)
}
