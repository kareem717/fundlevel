package account

import (
	"context"

	"fundlevel/internal/entities/investment"
	postgres "fundlevel/internal/storage/shared"
)

func (s *AccountService) GetInvestmentsByCursor(ctx context.Context, accountId int, limit int, cursor int, filter investment.InvestmentIntentFilter) ([]investment.InvestmentIntent, error) {
	paginationParams := postgres.CursorPagination{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Account().GetInvestmentsByCursor(ctx, accountId, paginationParams, filter)
}

func (s *AccountService) GetInvestmentsByPage(ctx context.Context, accountId int, pageSize int, page int, filter investment.InvestmentIntentFilter) ([]investment.InvestmentIntent, int, error) {
	paginationParams := postgres.OffsetPagination{
		PageSize: pageSize,
		Page:     page,
	}

	return s.repositories.Account().GetInvestmentsByPage(ctx, accountId, paginationParams, filter)
}

func (s *AccountService) GetInvestmentById(ctx context.Context, accountId int, investmentId int) (investment.InvestmentIntent, error) {
	return s.repositories.Account().GetInvestmentById(ctx, accountId, investmentId)
}

func (s *AccountService) IsInvestedInRound(ctx context.Context, accountId int, roundId int) (bool, error) {
	return s.repositories.Account().IsInvestedInRound(ctx, accountId, roundId)
}
