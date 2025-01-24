package investment

import (
	"context"

	"fundlevel/internal/entities/investment"

	"github.com/stripe/stripe-go/v81"
)

func (r *InvestmentRepository) CreatePayment(ctx context.Context, params investment.CreateInvestmentPaymentParams) (investment.InvestmentPayment, error) {
	resp := investment.InvestmentPayment{}

	err := r.db.NewInsert().
		Model(&params).
		ModelTableExpr("investment_payments").
		Returning("*").
		Scan(ctx, &resp)

	return resp, err
}

func (r *InvestmentRepository) UpdatePayment(ctx context.Context, id int, params investment.UpdateInvestmentPaymentParams) (investment.InvestmentPayment, error) {
	resp := investment.InvestmentPayment{}

	err := r.db.NewUpdate().
		Model(&params).
		ModelTableExpr("investment_payments").
		Where("investment_payments.id = ?", id).
		OmitZero().
		Returning("*").
		Scan(ctx, &resp)

	return resp, err
}

func (r *InvestmentRepository) GetPaymentById(ctx context.Context, id int) (investment.InvestmentPayment, error) {
	resp := investment.InvestmentPayment{}

	err := r.db.NewSelect().
		Model(&resp).
		Where("investment_payment.id = ?", id).
		Scan(ctx)

	return resp, err
}

func (r *InvestmentRepository) GetPaymentByIntentId(ctx context.Context, intentId string) (investment.InvestmentPayment, error) {
	resp := investment.InvestmentPayment{}

	err := r.db.NewSelect().
		Model(&resp).
		Where("investment_payment.stripe_payment_intent_id = ?", intentId).
		Scan(ctx)

	return resp, err
}

func (r *InvestmentRepository) GetPaymentsByInvestmentId(ctx context.Context, investmentId int) ([]investment.InvestmentPayment, error) {
	resp := []investment.InvestmentPayment{}

	err := r.db.NewSelect().
		Model(&resp).
		Where("investment_payment.investment_id = ?", investmentId).
		Scan(ctx)

	return resp, err
}

func (r *InvestmentRepository) GetCurrentPayment(ctx context.Context, investmentId int) (investment.InvestmentPayment, error) {
	resp := investment.InvestmentPayment{}

	err := r.db.NewSelect().
		Model(&resp).
		Where("investment_payment.investment_id = ?", investmentId).
		Where("investment_payment.status != ?", stripe.PaymentIntentStatusCanceled).
		Scan(ctx)

	return resp, err
}

func (r *InvestmentRepository) GetFailedPaymentCount(ctx context.Context, investmentId int) (int, error) {
	return r.db.NewSelect().
		Model(&investment.InvestmentPayment{}).
		Where("investment_payment.investment_id = ?", investmentId).
		Where("investment_payment.status = ?", stripe.PaymentIntentStatusCanceled).
		Count(ctx)
}
