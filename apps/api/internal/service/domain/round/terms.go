package round

import (
	"context"
	"fundlevel/internal/entities/round"
)

func (s *RoundService) GetTerms(ctx context.Context, id int) (round.RoundTerm, error) {
	return s.repositories.Round().GetTerms(ctx, id)
}
