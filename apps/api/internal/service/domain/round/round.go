package round

import (
	"context"
	"errors"
	"fundlevel/internal/entities/business"
	"fundlevel/internal/entities/round"
	"fundlevel/internal/storage"
	postgres "fundlevel/internal/storage/shared"
	"go.uber.org/zap"
)

type RoundService struct {
	repositories storage.Repository
	logger       *zap.Logger
}

// NewTestService returns a new instance of test service.
func NewRoundService(repositories storage.Repository, logger *zap.Logger) *RoundService {
	logger = logger.With(zap.String("service", "round"))

	return &RoundService{
		repositories: repositories,
		logger:       logger,
	}
}

func (s *RoundService) Create(ctx context.Context, params round.CreateRoundParams) (round.Round, error) {
	businessRecord, err := s.repositories.Business().GetById(ctx, params.Round.BusinessID)
	if err != nil {
		return round.Round{}, err
	}

	if businessRecord.Status != business.BusinessStatusActive {
		return round.Round{}, errors.New("business is not active")
	}

	params.Round.Status = round.RoundStatusActive

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

func (s *RoundService) GetAvailableShares(ctx context.Context, id int) (int, error) {
	return s.repositories.Round().GetAvailableShares(ctx, id)
}

func (s *RoundService) CompleteRound(ctx context.Context, id int) error {
	err := s.repositories.RunInTx(ctx, func(ctx context.Context, tx storage.Transaction) error {
		status := round.RoundStatusSuccessful
		_, err := s.repositories.Round().Update(ctx, id, round.UpdateRoundParams{
			Status: &status,
		})

		if err != nil {
			return err
		}

		err = s.repositories.Investment().CloseIncompleteInvestments(ctx, id)
		if err != nil {
			return err
		}

		return nil
	})

	return err
}
