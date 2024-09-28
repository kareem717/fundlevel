package round

import (
	"context"
	"errors"

	"fundlevel/internal/entities/investment"
	"fundlevel/internal/storage/postgres/shared"
)

func (s *RoundService) GetRoundInvestmentsByCursor(ctx context.Context, roundId int, limit int, cursor int) ([]investment.RoundInvestment, error) {
	paginationParams := shared.CursorPagination{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Round().GetRoundInvestmentsByCursor(ctx, roundId, paginationParams)
}

func (s *RoundService) GetRoundInvestmentsByPage(ctx context.Context, roundId int, pageSize int, page int) ([]investment.RoundInvestment, error) {
	paginationParams := shared.OffsetPagination{
		PageSize: pageSize,
		Page:     page,
	}

	return s.repositories.Round().GetRoundInvestmentsByPage(ctx, roundId, paginationParams)
}

func (s *RoundService) AcceptRoundInvestment(ctx context.Context, roundId int, investmentId int) error {
	currInvestment, err := s.repositories.Investment().GetById(ctx, investmentId)
	if err != nil {
		return err
	}

	if currInvestment.Status != investment.InvestmentStatusPending {
		return errors.New("investment is not pending")
	}

	updateParams := investment.UpdateInvestmentParams{}
	updateParams.Status = investment.InvestmentStatusAccepted

	_, err = s.repositories.Investment().Update(ctx, investmentId, updateParams)
	if err != nil {
		return err
	}

	return nil
}
