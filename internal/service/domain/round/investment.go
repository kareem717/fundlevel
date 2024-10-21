package round

import (
	"context"

	"fundlevel/internal/entities/investment"
	postgres "fundlevel/internal/storage/shared"
)

func (s *RoundService) GetInvestmentsByCursor(ctx context.Context, roundId int, limit int, cursor int, filter investment.InvestmentFilter) ([]investment.RoundInvestment, error) {
	paginationParams := postgres.CursorPagination{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Round().GetInvestmentsByCursor(ctx, roundId, paginationParams, filter)
}

func (s *RoundService) GetInvestmentsByPage(ctx context.Context, roundId int, pageSize int, page int, filter investment.InvestmentFilter) ([]investment.RoundInvestment, int, error) {
	paginationParams := postgres.OffsetPagination{
		PageSize: pageSize,
		Page:     page,
	}

	return s.repositories.Round().GetInvestmentsByPage(ctx, roundId, paginationParams, filter)
}

