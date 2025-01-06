package business

type RoundCreateRequirements struct {
	HasActiveStatus bool `json:"hasActiveStatus"`
	LegalSection    bool `json:"legalSection"`
	StripeAccount   bool `json:"stripeAccount"`
}
