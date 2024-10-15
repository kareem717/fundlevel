package venture

import (
	"context"
	"errors"

	"fundlevel/internal/entities/venture"
)

func (r *VentureService) CreateLike(ctx context.Context, params venture.CreateVentureLikeParams) (venture.VentureLike, error) {
	alreadyLiked, err := r.repositories.Venture().IsLikedByAccount(ctx, params.VentureID, params.AccountID)
	if err != nil {
		return venture.VentureLike{}, err
	}

	if alreadyLiked {
		return venture.VentureLike{}, errors.New("already liked")
	}

	return r.repositories.Venture().CreateLike(ctx, params)
}

func (r *VentureService) DeleteLike(ctx context.Context, ventureId int, accountId int) error {
	return r.repositories.Venture().DeleteLike(ctx, ventureId, accountId)
}

func (r *VentureService) IsLikedByAccount(ctx context.Context, ventureId int, accountId int) (bool, error) {
	return r.repositories.Venture().IsLikedByAccount(ctx, ventureId, accountId)
}

func (r *VentureService) GetLikeCount(ctx context.Context, ventureId int) (int, error) {
	return r.repositories.Venture().GetLikeCount(ctx, ventureId)
}
