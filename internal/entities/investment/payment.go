package investment

import (
	"fundlevel/internal/entities/shared"

	"github.com/stripe/stripe-go/v80"
	"github.com/uptrace/bun"
)

type PaymentStatus string

// FixedTotalRound represents an fixed total round entity.
type RoundInvestmentPayment struct {
	bun.BaseModel                   `bun:"table:round_investment_payments"`
	RoundInvestmentID               int                        `json:"roundInvestmentId"`
	Status                          stripe.PaymentIntentStatus `json:"status" enum:"cancelled,processing,requires_action,requires_capture,requires_confirmation,requires_payment_method,succeeded"`
	StripePaymentIntentID           string                     `json:"stripePaymentIntentId"`
	StripePaymentIntentClientSecret string                     `json:"stripePaymentIntentClientSecret"`
	shared.Timestamps
}

type CreateRoundInvestmentPaymentParams struct {
	RoundInvestmentID               int    `json:"roundInvestmentId"`
	StripePaymentIntentID           string `json:"stripePaymentIntentId"`
	StripePaymentIntentClientSecret string `json:"stripePaymentIntentClientSecret"`
}

type UpdateRoundInvestmentPaymentParams struct {
	Status stripe.PaymentIntentStatus `json:"status" enum:"cancelled,processing,requires_action,requires_capture,requires_confirmation,requires_payment_method,succeeded" hidden:"true" required:"false"`
}
