package business

type RoundCreateRequirements struct {
	HasActiveStatus bool `json:"has_active_status"`
	LegalSection    bool `json:"legal_section"`
	StripeAccount   bool `json:"stripe_account"`
}
