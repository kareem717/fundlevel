package investment

import (
	"context"
	"fundlevel/internal/entities/investment"
	"fundlevel/internal/storage"
)

type InvestmentService struct {
	repositories  storage.Repository
	stripeAPIKey  string
	feePercentage float64
}

type InvestmentServiceConfig struct {
	StripeAPIKey  string
	FeePercentage float64
}

// NewInvestmentService returns a new instance of investment service.
func NewInvestmentService(repositories storage.Repository, stripeAPIKey string, feePercentage float64) *InvestmentService {
	return &InvestmentService{
		repositories:  repositories,
		stripeAPIKey:  stripeAPIKey,
		feePercentage: feePercentage,
	}
}

func (s *InvestmentService) GetById(ctx context.Context, id int) (investment.Investment, error) {
	return s.repositories.Investment().GetById(ctx, id)
}


func (s *InvestmentService) Create(
	ctx context.Context,
	investorID int,
	params investment.CreateInvestmentParams,
) (investment.Investment, error) {
	return s.repositories.Investment().Create(ctx, investorID, params)
}