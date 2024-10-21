package investment

import (
	"context"
	"errors"

	"fundlevel/internal/entities/investment"
	"fundlevel/internal/storage"
)

type InvestmentService struct {
	repositories storage.Repository
}

// NewInvestmentService returns a new instance of investment service.
func NewInvestmentService(repositories storage.Repository) *InvestmentService {
	return &InvestmentService{
		repositories: repositories,
	}
}

func (s *InvestmentService) GetById(ctx context.Context, id int) (investment.RoundInvestment, error) {
	return s.repositories.Investment().GetById(ctx, id)
}

func (s *InvestmentService) Update(ctx context.Context, id int, params investment.UpdateInvestmentParams) (investment.RoundInvestment, error) {
	return s.repositories.Investment().Update(ctx, id, params)
}

func (s *InvestmentService) AcceptInvestment(ctx context.Context, investmentId int) error {
	updateParams := investment.UpdateInvestmentParams{}
	updateParams.Status = investment.InvestmentStatusAccepted

	_, err := s.repositories.Investment().Update(ctx, investmentId, updateParams)
	if err != nil {
		return err
	}

	return nil
}


func (s *InvestmentService) WithdrawInvestment(ctx context.Context, investmentId int) error {
	updateParams := investment.UpdateInvestmentParams{}
	updateParams.Status = investment.InvestmentStatusWithdrawn

	_, err := s.repositories.Investment().Update(ctx, investmentId, updateParams)
	if err != nil {
		return err
	}

	return nil
}

func (s *InvestmentService) DeleteInvestment(ctx context.Context, investmentId int) error {
	currInvestment, err := s.repositories.Investment().GetById(ctx, investmentId)
	if err != nil {
		return err
	}

	if currInvestment.Status != investment.InvestmentStatusPending {
		return errors.New("investment is not pending")
	}

	return s.repositories.Investment().Delete(ctx, investmentId)
}

func (s *InvestmentService) CreateInvestment(ctx context.Context, params investment.CreateInvestmentParams) (investment.RoundInvestment, error) {
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