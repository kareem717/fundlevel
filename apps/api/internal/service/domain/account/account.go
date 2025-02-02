package account

import (
	"context"
	"database/sql"

	"fundlevel/internal/entities/account"
	"fundlevel/internal/entities/investment"
	"fundlevel/internal/service/types"
	"fundlevel/internal/storage"

	"github.com/google/uuid"
	"go.uber.org/zap"
)

type AccountService struct {
	repositories storage.Repository
	stripeAPIKey string
	logger       *zap.Logger
}

// NewAccountService returns a new instance of account service.
func NewAccountService(repositories storage.Repository, stripeAPIKey string, logger *zap.Logger) *AccountService {
	logger = logger.With(zap.String("service", "account"))

	return &AccountService{
		repositories: repositories,
		stripeAPIKey: stripeAPIKey,
		logger:       logger,
	}
}

func (s *AccountService) GetById(ctx context.Context, id int) (account.Account, error) {
	return s.repositories.Account().GetById(ctx, id)
}

func (s *AccountService) GetByUserId(ctx context.Context, userId uuid.UUID) (account.Account, error) {
	return s.repositories.Account().GetByUserId(ctx, userId)
}

func (s *AccountService) Create(ctx context.Context, params account.CreateAccountParams, userId uuid.UUID) (account.Account, error) {
	return s.repositories.Account().Create(ctx, params, userId)
}

func (s *AccountService) Delete(ctx context.Context, id int) error {
	return s.repositories.Account().Delete(ctx, id)
}

func (s *AccountService) Update(ctx context.Context, id int, params account.UpdateAccountParams) (account.Account, error) {
	return s.repositories.Account().Update(ctx, id, params)
}

func (s *AccountService) GetInvestments(ctx context.Context, accountId, cursor, limit int, filter investment.InvestmentFilter) ([]investment.Investment, types.CursorPaginationOutput[int], error) {
	// We need to fetch one more than the limit to determine if there is a next page
	usedLimit := limit + 1	

	investments, err := s.repositories.Account().GetInvestments(ctx, accountId, cursor, usedLimit, filter)
	if err != nil {
		switch err {
		case sql.ErrNoRows:
			return []investment.Investment{}, types.CursorPaginationOutput[int]{}, nil
		default:
			s.logger.Error("failed to get investments", zap.Error(err))
			return []investment.Investment{}, types.CursorPaginationOutput[int]{}, err
		}
	}

	cursorOutput := types.CursorPaginationOutput[int]{}
	if len(investments) == usedLimit {
		cursorOutput.NextCursor = &investments[len(investments)-1].ID
	}

	return investments[:len(investments)-1], cursorOutput, nil

}
