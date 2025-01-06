package industry

import (
	"context"

	"fundlevel/internal/entities/industry"

	"github.com/uptrace/bun"
)

type IndustryRepository struct {
	db  bun.IDB
	ctx context.Context
}

// NewAccountRepository returns a new instance of the repository.
func NewIndustryRepository(db bun.IDB, ctx context.Context) *IndustryRepository {
	return &IndustryRepository{
		db:  db,
		ctx: ctx,
	}
}

func (r *IndustryRepository) GetAll(ctx context.Context) ([]industry.Industry, error) {
	resp := []industry.Industry{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Scan(ctx)

	return resp, err
}
