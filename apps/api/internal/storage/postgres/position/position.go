package position

import (
	"context"

	"fundlevel/internal/entities/position"

	"github.com/uptrace/bun"
)

type PositionRepository struct {
	db  bun.IDB
	ctx context.Context
}

// NewRoundRepository returns a new instance of the repository.
func NewPositionRepository(db bun.IDB, ctx context.Context) *PositionRepository {
	return &PositionRepository{
		db:  db,
		ctx: ctx,
	}
}

func (r *PositionRepository) Create(ctx context.Context, params position.CreatePositionParams) (position.Position, error) {
	resp := position.Position{}

	err := r.db.NewInsert().
		Model(&params).
		Returning("*").
		Scan(ctx, &resp)

	return resp, err
}
