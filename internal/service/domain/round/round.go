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

func (s *RoundService) GetByVentureId(ctx context.Context, ventureId int, limit int, cursor int) ([]round.Round, error) {
	paginationParams := shared.PaginationRequest{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Round().GetByVentureId(ctx, ventureId, paginationParams)
}

func (s *RoundService) GetAll(ctx context.Context, limit int, cursor int) ([]round.Round, error) {
	paginationParams := shared.PaginationRequest{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Round().GetAll(ctx, paginationParams)
}

func (s *RoundService) Create(ctx context.Context, params round.CreateRoundParams) (round.Round, error) {
	return s.repositories.Round().Create(ctx, params)
}

func (s *RoundService) Delete(ctx context.Context, id int) error {
	return s.repositories.Round().Delete(ctx, id)
}

func (s *RoundService) Update(ctx context.Context, id int, params round.UpdateRoundParams) (round.Round, error) {
	return s.repositories.Round().Update(ctx, id, params)
}
