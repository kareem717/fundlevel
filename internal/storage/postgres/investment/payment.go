package investment

// import (
// 	"context"

// 	"fundlevel/internal/entities/investment"
// )

// func (r *InvestmentRepository) CreatePayment(ctx context.Context, params investment.CreateInvestmentPaymentParams) (investment.InvestmentIntentPayment, error) {
// 	resp := investment.InvestmentIntentPayment{}

// 	err := r.db.NewInsert().
// 		Model(&params).
// 		ModelTableExpr("investment_payments").
// 		Returning("*").
// 		Scan(ctx, &resp)

// 	return resp, err
// }

// func (r *InvestmentRepository) UpdatePayment(ctx context.Context, investmentId int, params investment.UpdateInvestmentPaymentParams) (investment.InvestmentIntentPayment, error) {
// 	resp := investment.InvestmentIntentPayment{}

// 	err := r.db.NewUpdate().
// 		Model(&params).
// 		ModelTableExpr("investment_payments").
// 		Where("investment_payments.investment_id = ?", investmentId).
// 		OmitZero().
// 		Returning("*").
// 		Scan(ctx, &resp)

// 	return resp, err
// }

// func (r *InvestmentRepository) GetPayment(ctx context.Context, investmentId int) (investment.InvestmentIntentPayment, error) {
// 	resp := investment.InvestmentIntentPayment{}

// 	err := r.db.NewSelect().
// 		Model(&resp).
// 		Where("investment_payment.investment_id = ?", investmentId).
// 		Scan(ctx)

// 	return resp, err
// }

// func (r *InvestmentRepository) GetPaymentByIntentId(ctx context.Context, intentId string) (investment.InvestmentIntentPayment, error) {
// 	resp := investment.InvestmentIntentPayment{}

// 	err := r.db.NewSelect().
// 		Model(&resp).
// 		Where("investment_payment.stripe_payment_intent_id = ?", intentId).
// 		Scan(ctx)

// 	return resp, err
// }
