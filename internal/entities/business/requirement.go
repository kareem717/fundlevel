package business

type RoundCreateRequirements struct {
	LegalSection   bool `json:"legalSection"`
	AddressSection bool `json:"addressSection"`
	StripeAccount  bool `json:"stripeAccount"`
}
