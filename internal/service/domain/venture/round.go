package venture

import (
	"context"

	"fundlevel/internal/entities/round"
	"fundlevel/internal/storage/postgres/shared"
)

func (s *VentureService) GetRounds(ctx context.Context, id int, limit int, cursor int) ([]round.Round, error) {
	paginationParams := shared.PaginationRequest{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Venture().GetRounds(ctx, id, paginationParams)
}
