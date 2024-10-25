package analytic

import (
	"context"

	"fundlevel/internal/entities/analytic"
)

func (r *AnalyticRepository) IsVentureFavouritedByAccount(ctx context.Context, ventureId int, accountId int) (bool, error) {
	return r.db.
		NewSelect().
		Model(&analytic.VentureFavourite{}).
		Where("venture_id = ?", ventureId).
		Where("account_id = ?", accountId).
		Exists(ctx)
}

func (r *AnalyticRepository) CreateVentureFavourite(ctx context.Context, params analytic.CreateVentureFavouriteParams) error {
	_, err := r.db.NewInsert().
		Model(&params).
		ModelTableExpr("venture_favourites").
		Exec(ctx)

	return err
}

func (r *AnalyticRepository) DeleteVentureFavourite(ctx context.Context, ventureId int, accountId int) error {
	_, err := r.db.
		NewDelete().
		Model(&analytic.VentureFavourite{}).
		Where("venture_id = ?", ventureId).
		Where("account_id = ?", accountId).
		Exec(ctx)

	return err
}

func (r *AnalyticRepository) GetVentureFavouriteCount(ctx context.Context, ventureId int) (int, error) {
	return r.db.
		NewSelect().
		Model(&analytic.VentureFavourite{}).
		Where("venture_id = ?", ventureId).
		Count(ctx)
}

func (r *AnalyticRepository) IsRoundFavouritedByAccount(ctx context.Context, roundId int, accountId int) (bool, error) {
	return r.db.
		NewSelect().
		Model(&analytic.RoundFavourite{}).
		Where("round_id = ?", roundId).
		Where("account_id = ?", accountId).
		Exists(ctx)
}

func (r *AnalyticRepository) CreateRoundFavourite(ctx context.Context, params analytic.CreateRoundFavouriteParams) error {
	_, err := r.db.NewInsert().
		Model(&params).
		ModelTableExpr("round_favourites").
		Exec(ctx)

	return err
}

func (r *AnalyticRepository) DeleteRoundFavourite(ctx context.Context, roundId int, accountId int) error {
	_, err := r.db.
		NewDelete().
		Model(&analytic.RoundFavourite{}).
		Where("round_id = ?", roundId).
		Where("account_id = ?", accountId).
		Exec(ctx)

	return err
}

func (r *AnalyticRepository) GetRoundFavouriteCount(ctx context.Context, roundId int) (int, error) {
	return r.db.
		NewSelect().
		Model(&analytic.RoundFavourite{}).
		Where("round_id = ?", roundId).
		Count(ctx)
}

func (r *AnalyticRepository) IsBusinessFavouritedByAccount(ctx context.Context, businessId int, accountId int) (bool, error) {
	return r.db.
		NewSelect().
		Model(&analytic.BusinessFavourite{}).
		Where("business_id = ?", businessId).
		Where("account_id = ?", accountId).
		Exists(ctx)
}

func (r *AnalyticRepository) CreateBusinessFavourite(ctx context.Context, params analytic.CreateBusinessFavouriteParams) error {
	_, err := r.db.NewInsert().
		Model(&params).
		ModelTableExpr("business_favourites").
		Exec(ctx)

	return err
}

func (r *AnalyticRepository) DeleteBusinessFavourite(ctx context.Context, businessId int, accountId int) error {
	_, err := r.db.
		NewDelete().
		Model(&analytic.BusinessFavourite{}).
		Where("business_id = ?", businessId).
		Where("account_id = ?", accountId).
		Exec(ctx)

	return err
}

func (r *AnalyticRepository) GetBusinessFavouriteCount(ctx context.Context, businessId int) (int, error) {
	return r.db.
		NewSelect().
		Model(&analytic.BusinessFavourite{}).
		Where("business_id = ?", businessId).
		Count(ctx)
}
