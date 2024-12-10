package business

import (
	"context"

	"fundlevel/internal/entities/investment"
	postgres "fundlevel/internal/storage/shared"
)

func (s *BusinessService) GetInvestmentsByCursor(ctx context.Context, businessId int, limit int, cursor int, filter investment.InvestmentIntentFilter) ([]investment.InvestmentIntent, error) {
	paginationParams := postgres.CursorPagination{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Business().GetInvestmentsByCursor(ctx, businessId, paginationParams, filter)
}

func (s *BusinessService) GetInvestmentsByPage(ctx context.Context, businessId int, pageSize int, page int, filter investment.InvestmentIntentFilter) ([]investment.InvestmentIntent, int, error) {
	paginationParams := postgres.OffsetPagination{
		PageSize: pageSize,
		Page:     page,
	}

	return s.repositories.Business().GetInvestmentsByPage(ctx, businessId, paginationParams, filter)
}

func (s *BusinessService) GetTotalFunding(ctx context.Context, businessId int) (int, error) {
	return s.repositories.Business().GetTotalFunding(ctx, businessId)
}
