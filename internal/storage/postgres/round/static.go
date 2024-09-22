package round

import (
	"context"
	"fundlevel/internal/entities/round"
)

func (r *RoundRepository) CreateStatic(ctx context.Context, params round.CreateStaticRoundParams) (round.StaticRound, error) {
	resp := round.StaticRound{}

	err := r.db.
		NewInsert().
		Model(&params).
		ModelTableExpr("static_rounds").
		Returning("*").
		Scan(ctx, &resp)

	return resp, err
}
