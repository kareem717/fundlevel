package investment

import (
	"context"

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
	return s.repositories.Investment().Delete(ctx, investmentId)
}

func (s *InvestmentService) CreateInvestment(ctx context.Context, params investment.CreateInvestmentParams) (investment.RoundInvestment, error) {
	return s.repositories.Investment().Create(ctx, params)
}
