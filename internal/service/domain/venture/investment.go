package venture

import (
	"context"

	"fundlevel/internal/entities/investment"
	"fundlevel/internal/storage/postgres/shared"
)

func (s *VentureService) GetVentureRoundInvestmentsByCursor(ctx context.Context, ventureId int, limit int, cursor int) ([]investment.RoundInvestment, error) {
	paginationParams := shared.CursorPagination{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Venture().GetVentureRoundInvestmentsByCursor(ctx, ventureId, paginationParams)
}

func (s *VentureService) GetVentureRoundInvestmentsByPage(ctx context.Context, ventureId int, pageSize int, page int) ([]investment.RoundInvestment, error) {
	paginationParams := shared.OffsetPagination{
		PageSize: pageSize,
		Page:     page,
	}

	return s.repositories.Venture().GetVentureRoundInvestmentsByPage(ctx, ventureId, paginationParams)
}
