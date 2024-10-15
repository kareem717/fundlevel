package round

import (
	"context"
	"errors"

	"fundlevel/internal/entities/round"
)

func (r *RoundService) CreateLike(ctx context.Context, params round.CreateRoundLikeParams) (round.RoundLike, error) {
	alreadyLiked, err := r.repositories.Round().IsLikedByAccount(ctx, params.RoundID, params.AccountID)
	if err != nil {
		return round.RoundLike{}, err
	}

	if alreadyLiked {
		return round.RoundLike{}, errors.New("already liked")
	}

	return r.repositories.Round().CreateLike(ctx, params)
}

func (r *RoundService) DeleteLike(ctx context.Context, roundId int, accountId int) error {
	return r.repositories.Round().DeleteLike(ctx, roundId, accountId)
}

func (r *RoundService) IsLikedByAccount(ctx context.Context, roundId int, accountId int) (bool, error) {
	return r.repositories.Round().IsLikedByAccount(ctx, roundId, accountId)
}

func (r *RoundService) GetLikeCount(ctx context.Context, roundId int) (int, error) {
	return r.repositories.Round().GetLikeCount(ctx, roundId)
}
