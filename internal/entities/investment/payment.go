package investment

import (
	"fundlevel/internal/entities/shared"

	"github.com/stripe/stripe-go/v80"
	"github.com/uptrace/bun"
)

// InvestmentPayment represents a payment for an investment
type InvestmentPayment struct {
	bun.BaseModel                   `bun:"table:investment_payments"`
	ID                              int                        `bun:",pk,autoincrement" json:"id"`
	InvestmentID                    int                        `json:"investmentId"`
	Status                          stripe.PaymentIntentStatus `json:"status" enum:"cancelled,processing,requires_action,requires_capture,requires_confirmation,requires_payment_method,succeeded"`
	StripePaymentIntentID           string                     `json:"stripePaymentIntentId"`
	StripePaymentIntentClientSecret string                     `json:"stripePaymentIntentClientSecret"`
	shared.Timestamps
}

type CreateInvestmentPaymentParams struct {
	InvestmentID                    int                        `json:"investmentId"`
	StripePaymentIntentID           string                     `json:"stripePaymentIntentId"`
	StripePaymentIntentClientSecret string                     `json:"stripePaymentIntentClientSecret"`
	Status                          stripe.PaymentIntentStatus `json:"status" enum:"cancelled,processing,requires_action,requires_capture,requires_confirmation,requires_payment_method,succeeded"`
}

type UpdateInvestmentPaymentParams struct {
	Status stripe.PaymentIntentStatus `json:"status" enum:"cancelled,processing,requires_action,requires_capture,requires_confirmation,requires_payment_method,succeeded" hidden:"true" required:"false"`
}
