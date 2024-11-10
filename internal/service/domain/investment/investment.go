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

func (s *InvestmentService) GetById(ctx context.Context, id int) (investment.RoundInvestment, error) {
	return s.repositories.Investment().GetById(ctx, id)
}

func (s *InvestmentService) Update(ctx context.Context, id int, params investment.UpdateInvestmentParams) (investment.RoundInvestment, error) {
	return s.repositories.Investment().Update(ctx, id, params)
}

func (s *InvestmentService) Create(ctx context.Context, params investment.CreateInvestmentParams) (investment.RoundInvestment, error) {
	return s.repositories.Investment().Create(ctx, params)
}

// TODO: account for cancelling 
// func (s *InvestmentService) WithdrawInvestment(ctx context.Context, investmentId int) error {
// 	updateParams := investment.UpdateInvestmentParams{}
// 	updateParams.Status = investment.InvestmentStatusWithdrawn

// 	_, err := s.repositories.Investment().Update(ctx, investmentId, updateParams)
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }
