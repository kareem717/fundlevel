package types

type StripeSessionOutput struct {
	URL          string `json:"url" form:"uri"`
	ClientSecret string `json:"client_secret"`
}
