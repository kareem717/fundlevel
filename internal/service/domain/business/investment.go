package business

import (
	"context"

	"fundlevel/internal/entities/investment"
	"fundlevel/internal/storage/postgres/shared"
)

func (s *BusinessService) GetInvestmentsByCursor(ctx context.Context, businessId int, limit int, cursor int) ([]investment.RoundInvestment, error) {
	paginationParams := shared.CursorPagination{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Business().GetInvestmentsByCursor(ctx, businessId, paginationParams)
}

func (s *BusinessService) GetInvestmentsByPage(ctx context.Context, businessId int, pageSize int, page int) ([]investment.RoundInvestment, error) {
	paginationParams := shared.OffsetPagination{
		PageSize: pageSize,
		Page:     page,
	}

	return s.repositories.Business().GetInvestmentsByPage(ctx, businessId, paginationParams)
}

func (s *BusinessService) GetTotalFunding(ctx context.Context, businessId int) (int, error) {
	return s.repositories.Business().GetTotalFunding(ctx, businessId)
}
