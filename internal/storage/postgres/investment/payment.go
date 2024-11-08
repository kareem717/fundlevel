package investment

import (
	"context"

	"fundlevel/internal/entities/investment"
)

func (r *InvestmentRepository) CreatePayment(ctx context.Context, params investment.CreateRoundInvestmentPaymentParams) (investment.RoundInvestmentPayment, error) {
	resp := investment.RoundInvestmentPayment{}

	err := r.db.NewInsert().
		Model(&params).
		ModelTableExpr("round_investment_payments").
		Returning("*").
		Scan(ctx, &resp)

	return resp, err
}

func (r *InvestmentRepository) UpdatePayment(ctx context.Context, investmentId int, params investment.UpdateRoundInvestmentPaymentParams) (investment.RoundInvestmentPayment, error) {
	resp := investment.RoundInvestmentPayment{}

	err := r.db.NewUpdate().
		Model(&params).
		ModelTableExpr("round_investment_payments").
		Where("round_investment_payments.round_investment_id = ?", investmentId).
		OmitZero().
		Returning("*").
		Scan(ctx, &resp)

	return resp, err
}

func (r *InvestmentRepository) GetPayment(ctx context.Context, roundInvestmentId int) (investment.RoundInvestmentPayment, error) {
	resp := investment.RoundInvestmentPayment{}

	err := r.db.NewSelect().
		Model(&resp).
		Where("round_investment_payment.round_investment_id = ?", roundInvestmentId).
		Scan(ctx)

	return resp, err
}

func (r *InvestmentRepository) GetPaymentByIntentId(ctx context.Context, intentId string) (investment.RoundInvestmentPayment, error) {
	resp := investment.RoundInvestmentPayment{}

	err := r.db.NewSelect().
		Model(&resp).
		Where("round_investment_payment.stripe_payment_intent_id = ?", intentId).
		Scan(ctx)

	return resp, err
}
