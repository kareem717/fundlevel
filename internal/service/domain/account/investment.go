package account

import (
	"context"
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

func (s *AccountService) GetRecievedRoundInvestmentsByCursor(ctx context.Context, accountId int, limit int, cursor int) ([]investment.RoundInvestment, error) {
	paginationParams := shared.CursorPagination{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Account().GetRecievedRoundInvestmentsByCursor(ctx, accountId, paginationParams)
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
	isInvested, err := s.repositories.Account().IsInvestedInRound(ctx, params.InvestorID, params.RoundID)
	if err != nil {
		return investment.RoundInvestment{}, err
	}

	if isInvested {
		return investment.RoundInvestment{}, errors.New("account is already invested in round")
	}

	return s.repositories.Investment().Create(ctx, params)
}
