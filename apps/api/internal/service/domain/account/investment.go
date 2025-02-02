package account

import (
	"context"
	"database/sql"

	"fundlevel/internal/entities/investment"

	"go.uber.org/zap"
)

func (s *AccountService) GetActiveRoundInvestment(ctx context.Context, accountId int, roundId int) (investment.Investment, error) {
	return s.repositories.Account().GetActiveRoundInvestment(ctx, accountId, roundId)
}
func (s *AccountService) GetInvestments(ctx context.Context, accountId, cursor, limit int, filter investment.InvestmentFilter) ([]investment.Investment, *int, error) {
	// We need to fetch one more than the limit to determine if there is a next page
	usedLimit := limit + 1

	investments, err := s.repositories.Account().GetInvestments(ctx, accountId, cursor, usedLimit, filter)
	if err != nil {
		switch err {
		case sql.ErrNoRows:
			return []investment.Investment{}, nil, nil
		default:
			s.logger.Error("failed to get investments", zap.Error(err))
			return []investment.Investment{}, nil, err
		}
	}

	if len(investments) >= usedLimit {
		lastItemIdx := usedLimit - 1
		return investments[:lastItemIdx], &investments[lastItemIdx].ID, nil
	}

	return investments, nil, nil

}
