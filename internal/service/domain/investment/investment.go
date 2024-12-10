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

func (s *InvestmentService) GetIntentById(ctx context.Context, id int) (investment.InvestmentIntent, error) {
	return s.repositories.Investment().GetIntentById(ctx, id)
}

func (s *InvestmentService) Update(ctx context.Context, id int, params investment.UpdateInvestmentIntentParams) (investment.InvestmentIntent, error) {
	return s.repositories.Investment().UpdateIntent(ctx, id, params)
}

func (s *InvestmentService) Create(ctx context.Context, params investment.CreateInvestmentIntentParams) (investment.InvestmentIntent, error) {
	return s.repositories.Investment().CreateIntent(ctx, params)
}

// TODO: account for cancelling
// func (s *InvestmentService) WithdrawInvestment(ctx context.Context, investmentId int) error {
// 	updateParams := investment.UpdateInvestmentParams{}
// 	updateParams.Status = investment.InvestmentIntentStatusWithdrawn

// 	_, err := s.repositories.Investment().Update(ctx, investmentId, updateParams)
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }
