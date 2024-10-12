package business

import (
	"context"

	"fundlevel/internal/entities/investment"
	"fundlevel/internal/storage/postgres/shared"
)

func (s *BusinessService) GetRecievedRoundInvestmentsByCursor(ctx context.Context, businessId int, limit int, cursor int) ([]investment.RoundInvestment, error) {
	paginationParams := shared.CursorPagination{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Business().GetRecievedRoundInvestmentsByCursor(ctx, businessId, paginationParams)
}
