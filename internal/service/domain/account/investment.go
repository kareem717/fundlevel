package account

import (
	"context"
	"database/sql"
	"errors"

	"fundlevel/internal/entities/investment"
	"fundlevel/internal/storage/postgres/shared"
)

func (s *AccountService) GetRoundInvestmentsByCursor(ctx context.Context, accountId int, limit int, cursor int) ([]investment.RoundInvestment, error) {
	paginationParams := shared.CursorPagination{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Account().GetRoundInvestmentsByCursor(ctx, accountId, paginationParams)
}

func (s *AccountService) GetRoundInvestmentsByPage(ctx context.Context, accountId int, pageSize int, page int) ([]investment.RoundInvestment, error) {
	paginationParams := shared.OffsetPagination{
		PageSize: pageSize,
		Page:     page,
	}

	return s.repositories.Account().GetRoundInvestmentsByPage(ctx, accountId, paginationParams)
}

func (s *AccountService) WithdrawRoundInvestment(ctx context.Context, accountId int, investmentId int) error {
	currInvestment, err := s.repositories.Investment().GetById(ctx, investmentId)
	if err != nil {
		return err
	}

	if currInvestment.Status != investment.InvestmentStatusPending {
		return errors.New("investment is not pending")
	}

	updateParams := investment.UpdateInvestmentParams{}
	updateParams.Status = investment.InvestmentStatusWithdrawn

	_, err = s.repositories.Investment().Update(ctx, investmentId, updateParams)
	if err != nil {
		return err
	}

	return nil
}

func (s *AccountService) DeleteRoundInvestment(ctx context.Context, accountId int, investmentId int) error {
	currInvestment, err := s.repositories.Investment().GetById(ctx, investmentId)
	if err != nil {
		return err
	}

	if currInvestment.Status != investment.InvestmentStatusPending {
		return errors.New("investment is not pending")
	}

	return s.repositories.Investment().Delete(ctx, investmentId)
}

func (s *AccountService) CreateRoundInvestment(ctx context.Context, params investment.CreateInvestmentParams) (investment.RoundInvestment, error) {
	// make sure the account isn't already invested in the round without a withdrawal
	currInvestment, err := s.repositories.Investment().GetByRoundIdAndAccountId(ctx, params.RoundID, params.InvestorID)
	if err != nil {
		if err == sql.ErrNoRows {
			// No existing investment found, proceed to create a new one
			return s.repositories.Investment().Create(ctx, params)
		}
		return investment.RoundInvestment{}, err
	}

	if currInvestment.Status != investment.InvestmentStatusWithdrawn {
		return investment.RoundInvestment{}, errors.New("investment is not withdrawn")
	}

	return s.repositories.Investment().Create(ctx, params)
}
