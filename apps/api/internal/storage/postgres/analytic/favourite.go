package analytic

import (
	"context"

	"fundlevel/internal/entities/analytic"
)

func (r *AnalyticRepository) IsRoundFavouritedByAccount(ctx context.Context, roundId int, accountId int) (bool, error) {
	return r.db.
		NewSelect().
		Model(&analytic.RoundFavourite{}).
		Where("round_id = ?", roundId).
		Where("account_id = ?", accountId).
		Exists(ctx)
}

func (r *AnalyticRepository) CreateRoundFavourite(ctx context.Context, roundId int, accountId int) error {
	_, err := r.db.NewInsert().
		Model((*analytic.RoundFavourite)(nil)).
		Value("round_id", "?", roundId).
		Value("account_id", "?", accountId).
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

func (r *AnalyticRepository) CreateBusinessFavourite(ctx context.Context, businessId int, accountId int) error {
	_, err := r.db.NewInsert().
		Model((*analytic.BusinessFavourite)(nil)).
		Value("business_id", "?", businessId).
		Value("account_id", "?", accountId).
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
