package round

import (
	"context"
	"fundlevel/internal/entities/round"
	"fundlevel/internal/storage/postgres/shared"

	"fundlevel/internal/storage"
)

type RoundService struct {
	repositories storage.Repository
}

// NewTestService returns a new instance of test service.
func NewRoundService(repositories storage.Repository) *RoundService {
	return &RoundService{
		repositories: repositories,
	}
}

func (s *RoundService) GetById(ctx context.Context, id int) (round.RoundWithSubtypes, error) {
	return s.repositories.Round().GetById(ctx, id)
}

func (s *RoundService) GetByPage(ctx context.Context, pageSize int, page int) ([]round.RoundWithSubtypes, error) {
	paginationParams := shared.OffsetPagination{
		PageSize: pageSize,
		Page:     page,
	}

	return s.repositories.Round().GetByPage(ctx, paginationParams)
}

func (s *RoundService) GetByCursor(ctx context.Context, limit int, cursor int) ([]round.RoundWithSubtypes, error) {
	paginationParams := shared.CursorPagination{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Round().GetByCursor(ctx, paginationParams)
}