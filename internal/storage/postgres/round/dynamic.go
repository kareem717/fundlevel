package round

import (
	"context"
	"fundlevel/internal/entities/round"
)

func (r *RoundRepository) CreateDynamic(ctx context.Context, params round.CreateDynamicRoundParams) (round.DynamicRound, error) {
	resp := round.DynamicRound{}

	err := r.db.
		NewInsert().
		Model(&params).
		ModelTableExpr("dynamic_rounds").
		Returning("*").
		Scan(ctx, &resp)

	return resp, err
}

func (r *RoundRepository) UpdateDynamic(ctx context.Context, id int, params round.UpdateDynamicRoundParams) (round.DynamicRound, error) {
	resp := round.DynamicRound{}

	err := r.db.
		NewUpdate().
		Model(&params).
		ModelTableExpr("dynamic_rounds").
		Returning("*").
		Scan(ctx, &resp)

	return resp, err
}
