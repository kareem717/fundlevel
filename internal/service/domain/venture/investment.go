package venture

import (
	"context"

	"fundlevel/internal/entities/investment"
	postgres "fundlevel/internal/storage/shared"
)

func (s *VentureService) GetInvestmentsByCursor(ctx context.Context, ventureId int, limit int, cursor int) ([]investment.RoundInvestment, error) {
	paginationParams := postgres.CursorPagination{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Venture().GetInvestmentsByCursor(ctx, ventureId, paginationParams)
}

func (s *VentureService) GetInvestmentsByPage(ctx context.Context, ventureId int, pageSize int, page int) ([]investment.RoundInvestment, error) {
	paginationParams := postgres.OffsetPagination{
		PageSize: pageSize,
		Page:     page,
	}

	return s.repositories.Venture().GetInvestmentsByPage(ctx, ventureId, paginationParams)
}
