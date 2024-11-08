package investment

import (
	"context"

	"fundlevel/internal/entities/investment"
	"fundlevel/internal/service/domain/billing"
	"fundlevel/internal/storage"
)

type InvestmentService struct {
	repositories   storage.Repository
	billingService *billing.BillingService
}

// NewInvestmentService returns a new instance of investment service.
func NewInvestmentService(repositories storage.Repository, billingService *billing.BillingService) *InvestmentService {
	return &InvestmentService{
		repositories:   repositories,
		billingService: billingService,
	}
}

func (s *InvestmentService) GetById(ctx context.Context, id int) (investment.RoundInvestment, error) {
	return s.repositories.Investment().GetById(ctx, id)
}

func (s *InvestmentService) Update(ctx context.Context, id int, params investment.UpdateInvestmentParams) (investment.RoundInvestment, error) {
	return s.repositories.Investment().Update(ctx, id, params)
}

func (s *InvestmentService) ProcessInvestment(ctx context.Context, investmentId int) error {
	updateParams := investment.UpdateInvestmentParams{}
	updateParams.Status = investment.InvestmentStatusProcessing

	return s.repositories.RunInTx(ctx, func(ctx context.Context, tx storage.Transaction) error {
		investmentRecord, err := s.repositories.Investment().Update(ctx, investmentId, updateParams)
		if err != nil {
			return err
		}

		round, err := tx.Round().GetById(ctx, investmentRecord.RoundID)
		if err != nil {
			return err
		}

		checkoutPrice := int(round.BuyIn * 100)

		paymentIntent, err := s.billingService.CreateInvestmentPaymentIntent(ctx, checkoutPrice, investmentRecord.ID, round.ValueCurrency, round.Venture.Business.StripeConnectedAccountID)
		if err != nil {
			return err
		}

		paymentParams := investment.CreateRoundInvestmentPaymentParams{
			RoundInvestmentID:               investmentRecord.ID,
			StripePaymentIntentID:           paymentIntent.ID,
			StripePaymentIntentClientSecret: paymentIntent.ClientSecret,
		}
		_, err = tx.Investment().CreatePayment(ctx, paymentParams)
		if err != nil {
			return err
		}

		return nil
	})
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
