package investment

import (
	"context"
	"fundlevel/internal/entities/investment"
	"fundlevel/internal/storage"
)

func (s *InvestmentService) GetPayments(ctx context.Context, investmentId int) ([]investment.Payment, error) {
	return s.repositories.Investment().GetPaymentsByInvestmentId(ctx, investmentId)
}

func (s *InvestmentService) GetCurrentPayment(ctx context.Context, investmentId int) (investment.Payment, error) {
	return s.repositories.Investment().GetCurrentPayment(ctx, investmentId)
}

func (s *InvestmentService) CreatePayment(ctx context.Context, investmentId int) (investment.Payment, error) {
	resp := investment.Payment{}

	investmentRecord, err := s.repositories.Investment().GetById(ctx, investmentId)
	if err != nil {
		return resp, err
	}

	err = s.repositories.RunInTx(ctx, func(ctx context.Context, tx storage.Transaction) error {
		intent, err := s.createStripePaymentIntent(investmentId, investmentRecord.UsdCentValue)
		if err != nil {
			return err
		}

		resp, err = tx.Investment().CreatePayment(ctx, investmentId, investment.CreatePaymentParams{
			StripePaymentIntentID:           intent.ID,
			StripePaymentIntentClientSecret: intent.ClientSecret,
			Status:                          intent.Status,
			TotalUsdCents:                   intent.Amount,
		})
		if err != nil {
			return err
		}

		return nil
	})

	return resp, err
}
