package types

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
