package venture

import (
	"context"

	"fundlevel/internal/entities/venture"
)

func (r *VentureRepository) IsLikedByAccount(ctx context.Context, ventureId int, accountId int) (bool, error) {
	return r.db.
		NewSelect().
		Model(&venture.VentureLike{}).
		Where("venture_id = ?", ventureId).
		Where("account_id = ?", accountId).
		Exists(ctx)
}

func (r *VentureRepository) CreateLike(ctx context.Context, params venture.CreateVentureLikeParams) (venture.VentureLike, error) {
	resp := venture.VentureLike{}

	err := r.db.NewInsert().
		Model(&params).
		ModelTableExpr("venture_likes").
		Returning("*").
		Scan(ctx, &resp)

	return resp, err
}

func (r *VentureRepository) DeleteLike(ctx context.Context, ventureId int, accountId int) error {
	_, err := r.db.
		NewDelete().
		Model(&venture.VentureLike{}).
		Where("venture_id = ?", ventureId).
		Where("account_id = ?", accountId).
		Exec(ctx)

	return err
}

func (r *VentureRepository) GetLikeCount(ctx context.Context, ventureId int) (int, error) {
	return r.db.
		NewSelect().
		Model(&venture.VentureLike{}).
		Where("venture_id = ?", ventureId).
		Count(ctx)
}
