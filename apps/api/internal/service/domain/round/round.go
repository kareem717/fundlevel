package round

import (
	"context"
	"errors"
	"fundlevel/internal/entities/business"
	"fundlevel/internal/entities/round"
	postgres "fundlevel/internal/storage/shared"

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

func (s *RoundService) Create(ctx context.Context, params round.CreateRoundParams) (round.Round, error) {
	businessRecord, err := s.repositories.Business().GetById(ctx, params.BusinessID)
	if err != nil {
		return round.Round{}, err
	}

	if businessRecord.Status != business.BusinessStatusActive {
		return round.Round{}, errors.New("business is not active")
	}

	params.Status = round.RoundStatusActive

	return s.repositories.Round().Create(ctx, params)
}

func (s *RoundService) GetById(ctx context.Context, id int) (round.Round, error) {
	return s.repositories.Round().GetById(ctx, id)
}

func (s *RoundService) GetByPage(ctx context.Context, pageSize int, page int) ([]round.Round, int, error) {
	paginationParams := postgres.OffsetPagination{
		PageSize: pageSize,
		Page:     page,
	}

	return s.repositories.Round().GetByPage(ctx, paginationParams)
}

func (s *RoundService) GetByCursor(ctx context.Context, limit int, cursor int) ([]round.Round, error) {
	paginationParams := postgres.CursorPagination{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Round().GetByCursor(ctx, paginationParams)
}

func (s *RoundService) Delete(ctx context.Context, id int) error {
	return s.repositories.Round().Delete(ctx, id)
}
