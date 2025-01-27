package investment

import (
	"fundlevel/internal/entities/shared"

	"github.com/stripe/stripe-go/v81"
	"github.com/uptrace/bun"
)

// Payment represents a investment intent payment entity.
type Payment struct {
	bun.BaseModel `bun:"table:investment_payments"`
	shared.IntegerID

	InvestmentID                    int                        `json:"investment_id" minimum:"1"`
	Status                          stripe.PaymentIntentStatus `json:"status" enum:"cancelled,processing,requires_action,requires_capture,requires_confirmation,requires_payment_method,succeeded"`
	StripePaymentIntentID           string                     `json:"stripe_payment_intent_id"`
	StripePaymentIntentClientSecret string                     `json:"stripe_payment_intent_client_secret"`
	TotalUsdCents                   int64                        `json:"total_usd_cents" minimum:"1"`

	shared.Timestamps
}

// CreatePaymentParams is the params for creating a payment entity.
type CreatePaymentParams struct {
	StripePaymentIntentID           string                     `json:"stripe_payment_intent_id"`
	StripePaymentIntentClientSecret string                     `json:"stripe_payment_intent_client_secret"`
	Status                          stripe.PaymentIntentStatus `json:"status" enum:"cancelled,processing,requires_action,requires_capture,requires_confirmation,requires_payment_method,succeeded"`
	TotalUsdCents                   int64                       `json:"total_usd_cents" minimum:"1"`
}

// UpdatePaymentParams is the params for updating a payment entity.
type UpdatePaymentParams struct {
	Status *stripe.PaymentIntentStatus `json:"status" enum:"cancelled,processing,requires_action,requires_capture,requires_confirmation,requires_payment_method,succeeded" hidden:"true" required:"false"`
}
