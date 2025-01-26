package round

import (
	"context"
	"fundlevel/internal/entities/round"
)

func (r *RoundRepository) GetTerms(ctx context.Context, id int) (round.RoundTerm, error) {
	resp := round.RoundTerm{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Where("id = ?", id).
		Scan(ctx)

	return resp, err
}
