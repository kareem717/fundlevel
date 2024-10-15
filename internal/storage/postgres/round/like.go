package round

import (
	"context"

	"fundlevel/internal/entities/round"
)

func (r *RoundRepository) IsLikedByAccount(ctx context.Context, roundId int, accountId int) (bool, error) {
	return r.db.
		NewSelect().
		Model(&round.RoundLike{}).
		Where("round_id = ?", roundId).
		Where("account_id = ?", accountId).
		Exists(ctx)
}

func (r *RoundRepository) CreateLike(ctx context.Context, params round.CreateRoundLikeParams) (round.RoundLike, error) {
	resp := round.RoundLike{}

	err := r.db.NewInsert().
		Model(&params).
		ModelTableExpr("round_likes").
		Returning("*").
		Scan(ctx, &resp)

	return resp, err
}

func (r *RoundRepository) DeleteLike(ctx context.Context, roundId int, accountId int) error {
	_, err := r.db.
		NewDelete().
		Model(&round.RoundLike{}).
		Where("round_id = ?", roundId).
		Where("account_id = ?", accountId).
		Exec(ctx)

	return err
}

func (r *RoundRepository) GetLikeCount(ctx context.Context, roundId int) (int, error) {
	return r.db.
		NewSelect().
		Model(&round.RoundLike{}).
		Where("round_id = ?", roundId).
		Count(ctx)
}
