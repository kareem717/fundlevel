package types

import "github.com/stripe/stripe-go/v81"

type StripeClientSecret struct {
	ClientSecret string `json:"client_secret"`
}

type URLField struct {
	URL string `json:"url" form:"uri"`
}

type StripeSessionOutput struct {
	StripeClientSecret
	URLField
}

type StripePaymentIntentOutput struct {
	StripeClientSecret
	Status stripe.PaymentIntentStatus `json:"status" enum:"requires_payment_method,requires_confirmation,requires_action,processing,requires_capture,canceled,succeeded"`
}
