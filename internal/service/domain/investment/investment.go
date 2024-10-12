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
