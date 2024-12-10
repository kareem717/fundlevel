package investment

import (
	"context"
	"fundlevel/internal/entities/investment"
)

func (s *InvestmentService) GetPayments(ctx context.Context, investmentId int) ([]investment.InvestmentPayment, error) {
	return s.repositories.Investment().GetPaymentsByInvestmentId(ctx, investmentId)
}
