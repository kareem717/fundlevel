package round

import (
	"context"
	"errors"
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

func (s *RoundService) Create(ctx context.Context, params round.CreateRoundParams) (round.Round, error) {
	// Calculate the buy-in value for the round

	hasActiveRound, err := s.repositories.Venture().HasActiveRound(ctx, params.VentureID)
	if err != nil {
		return round.Round{}, err
	}

	if hasActiveRound {
		return round.Round{}, errors.New("active round already exists")
	}

	params.BuyIn = float64(params.PercentageValue) / float64(params.InvestorCount)
	params.Status = round.Active

	return s.repositories.Round().Create(ctx, params)
}

func (s *RoundService) GetById(ctx context.Context, id int) (round.Round, error) {
	return s.repositories.Round().GetById(ctx, id)
}

func (s *RoundService) GetByPage(ctx context.Context, pageSize int, page int) ([]round.Round, error) {
	paginationParams := shared.OffsetPagination{
		PageSize: pageSize,
		Page:     page,
	}

	return s.repositories.Round().GetByPage(ctx, paginationParams)
}

func (s *RoundService) GetByCursor(ctx context.Context, limit int, cursor int) ([]round.Round, error) {
	paginationParams := shared.CursorPagination{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Round().GetByCursor(ctx, paginationParams)
}

func (s *RoundService) Delete(ctx context.Context, id int) error {
	return s.repositories.Round().Delete(ctx, id)
}
