package round

import (
	"context"

	"fundlevel/internal/entities/round"
	"fundlevel/internal/storage"
	"fundlevel/internal/storage/postgres/shared"
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

func (s *RoundService) GetById(ctx context.Context, id int) (round.Round, error) {
	return s.repositories.Round().GetById(ctx, id)
}

func (s *RoundService) GetManyByCursor(ctx context.Context, limit int, cursor int) ([]round.Round, error) {
	paginationParams := shared.CursorPagination{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Round().GetManyByCursor(ctx, paginationParams)
}

func (s *RoundService) GetManyByPage(ctx context.Context, pageSize int, page int) ([]round.Round, error) {
	paginationParams := shared.OffsetPagination{
		PageSize: pageSize,
		Page:     page,
	}

	return s.repositories.Round().GetManyByPage(ctx, paginationParams)
}

func (s *RoundService) Create(ctx context.Context, params round.CreateRoundParams) (round.Round, error) {
	return s.repositories.Round().Create(ctx, params)
}

func (s *RoundService) Delete(ctx context.Context, id int) error {
	return s.repositories.Round().Delete(ctx, id)
}
