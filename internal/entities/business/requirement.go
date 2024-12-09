package business

type RoundCreateRequirements struct {
	LegalSection   bool `json:"legalSection"`
	StripeAccount  bool `json:"stripeAccount"`
}
