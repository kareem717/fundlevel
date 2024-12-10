package investment

// import (
// 	"fundlevel/internal/entities/shared"

// 	"github.com/stripe/stripe-go/v80"
// 	"github.com/uptrace/bun"
// )

// type PaymentStatus string

// // FixedTotalRound represents an fixed total round entity.
// type InvestmentPayment struct {
// 	bun.BaseModel                   `bun:"table:investment_payments"`
// 	InvestmentID               int                        `json:"investmentId"`
// 	Status                          stripe.PaymentIntentStatus `json:"status" enum:"cancelled,processing,requires_action,requires_capture,requires_confirmation,requires_payment_method,succeeded"`
// 	StripePaymentIntentID           string                     `json:"stripePaymentIntentId"`
// 	StripePaymentIntentClientSecret string                     `json:"stripePaymentIntentClientSecret"`
// 	shared.Timestamps
// }

// type CreateInvestmentPaymentParams struct {
// 	InvestmentID               int    `json:"investmentId"`
// 	StripePaymentIntentID           string `json:"stripePaymentIntentId"`
// 	StripePaymentIntentClientSecret string `json:"stripePaymentIntentClientSecret"`
// 	Status                          stripe.PaymentIntentStatus `json:"status" enum:"cancelled,processing,requires_action,requires_capture,requires_confirmation,requires_payment_method,succeeded"`
// }

// type UpdateInvestmentPaymentParams struct {
// 	Status stripe.PaymentIntentStatus `json:"status" enum:"cancelled,processing,requires_action,requires_capture,requires_confirmation,requires_payment_method,succeeded" hidden:"true" required:"false"`
// }
