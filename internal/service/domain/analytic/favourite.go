package analytic

import (
	"context"

	entities "fundlevel/internal/entities/analytic"
)

func (s *AnalyticService) GetRoundFavouriteCount(ctx context.Context, roundID int) (int, error) {
	return s.repositories.Favourite().GetRoundFavouriteCount(ctx, roundID)
}

func (s *AnalyticService) GetVentureFavouriteCount(ctx context.Context, ventureID int) (int, error) {
	return s.repositories.Favourite().GetVentureFavouriteCount(ctx, ventureID)
}

func (s *AnalyticService) GetBusinessFavouriteCount(ctx context.Context, businessID int) (int, error) {
	return s.repositories.Favourite().GetBusinessFavouriteCount(ctx, businessID)
}

func (s *AnalyticService) IsRoundFavouritedByAccount(ctx context.Context, roundID int, accountID int) (bool, error) {
	return s.repositories.Favourite().IsRoundFavouritedByAccount(ctx, roundID, accountID)
}

func (s *AnalyticService) IsVentureFavouritedByAccount(ctx context.Context, ventureID int, accountID int) (bool, error) {
	return s.repositories.Favourite().IsVentureFavouritedByAccount(ctx, ventureID, accountID)
}

func (s *AnalyticService) IsBusinessFavouritedByAccount(ctx context.Context, businessID int, accountID int) (bool, error) {
	return s.repositories.Favourite().IsBusinessFavouritedByAccount(ctx, businessID, accountID)
}

func (s *AnalyticService) CreateRoundFavourite(ctx context.Context, params entities.CreateRoundFavouriteParams) error {
	return s.repositories.Favourite().CreateRoundFavourite(ctx, params)
}

func (s *AnalyticService) DeleteRoundFavourite(ctx context.Context, roundID int, accountID int) error {
	return s.repositories.Favourite().DeleteRoundFavourite(ctx, roundID, accountID)
}

func (s *AnalyticService) CreateVentureFavourite(ctx context.Context, params entities.CreateVentureFavouriteParams) error {
	return s.repositories.Favourite().CreateVentureFavourite(ctx, params)
}

func (s *AnalyticService) DeleteVentureFavourite(ctx context.Context, ventureID int, accountID int) error {
	return s.repositories.Favourite().DeleteVentureFavourite(ctx, ventureID, accountID)
}

func (s *AnalyticService) CreateBusinessFavourite(ctx context.Context, params entities.CreateBusinessFavouriteParams) error {
	return s.repositories.Favourite().CreateBusinessFavourite(ctx, params)
}

func (s *AnalyticService) DeleteBusinessFavourite(ctx context.Context, businessID int, accountID int) error {
	return s.repositories.Favourite().DeleteBusinessFavourite(ctx, businessID, accountID)
}
