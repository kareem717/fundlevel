package favourite

import (
	"context"

	"fundlevel/internal/entities/analytic"

	"github.com/uptrace/bun"
)

type FavouriteRepository struct {
	db  bun.IDB
	ctx context.Context
}

func NewFavouriteRepository(db bun.IDB, ctx context.Context) *FavouriteRepository {
	return &FavouriteRepository{
		db:  db,
		ctx: ctx,
	}
}
func (r *FavouriteRepository) IsVentureFavouritedByAccount(ctx context.Context, ventureId int, accountId int) (bool, error) {
	return r.db.
		NewSelect().
		Model(&analytic.VentureFavourite{}).
		Where("venture_id = ?", ventureId).
		Where("account_id = ?", accountId).
		Exists(ctx)
}

func (r *FavouriteRepository) CreateVentureFavourite(ctx context.Context, params analytic.CreateVentureFavouriteParams) error {
	_, err := r.db.NewInsert().
		Model(&params).
		ModelTableExpr("venture_favourites").
		Exec(ctx)

	return err
}

func (r *FavouriteRepository) DeleteVentureFavourite(ctx context.Context, ventureId int, accountId int) error {
	_, err := r.db.
		NewDelete().
		Model(&analytic.VentureFavourite{}).
		Where("venture_id = ?", ventureId).
		Where("account_id = ?", accountId).
		Exec(ctx)

	return err
}

func (r *FavouriteRepository) GetVentureFavouriteCount(ctx context.Context, ventureId int) (int, error) {
	return r.db.
		NewSelect().
		Model(&analytic.VentureFavourite{}).
		Where("venture_id = ?", ventureId).
		Count(ctx)
}

func (r *FavouriteRepository) IsRoundFavouritedByAccount(ctx context.Context, roundId int, accountId int) (bool, error) {
	return r.db.
		NewSelect().
		Model(&analytic.RoundFavourite{}).
		Where("round_id = ?", roundId).
		Where("account_id = ?", accountId).
		Exists(ctx)
}

func (r *FavouriteRepository) CreateRoundFavourite(ctx context.Context, params analytic.CreateRoundFavouriteParams) error {
	_, err := r.db.NewInsert().
		Model(&params).
		ModelTableExpr("round_favourites").
		Exec(ctx)

	return err
}

func (r *FavouriteRepository) DeleteRoundFavourite(ctx context.Context, roundId int, accountId int) error {
	_, err := r.db.
		NewDelete().
		Model(&analytic.RoundFavourite{}).
		Where("round_id = ?", roundId).
		Where("account_id = ?", accountId).
		Exec(ctx)

	return err
}

func (r *FavouriteRepository) GetRoundFavouriteCount(ctx context.Context, roundId int) (int, error) {
	return r.db.
		NewSelect().
		Model(&analytic.RoundFavourite{}).
		Where("round_id = ?", roundId).
		Count(ctx)
}

func (r *FavouriteRepository) IsBusinessFavouritedByAccount(ctx context.Context, businessId int, accountId int) (bool, error) {
	return r.db.
		NewSelect().
		Model(&analytic.BusinessFavourite{}).
		Where("business_id = ?", businessId).
		Where("account_id = ?", accountId).
		Exists(ctx)
}

func (r *FavouriteRepository) CreateBusinessFavourite(ctx context.Context, params analytic.CreateBusinessFavouriteParams) error {
	_, err := r.db.NewInsert().
		Model(&params).
		ModelTableExpr("business_favourites").
		Exec(ctx)

	return err
}

func (r *FavouriteRepository) DeleteBusinessFavourite(ctx context.Context, businessId int, accountId int) error {
	_, err := r.db.
		NewDelete().
		Model(&analytic.BusinessFavourite{}).
		Where("business_id = ?", businessId).
		Where("account_id = ?", accountId).
		Exec(ctx)

	return err
}

func (r *FavouriteRepository) GetBusinessFavouriteCount(ctx context.Context, businessId int) (int, error) {
	return r.db.
		NewSelect().
		Model(&analytic.BusinessFavourite{}).
		Where("business_id = ?", businessId).
		Count(ctx)
}
