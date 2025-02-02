package investment

type InvestmentFilter struct {
	Statuses *[]InvestmentStatus `json:"statuses" minItems:"1" uniqueItems:"true" enum:"awaiting_confirmation,awaiting_payment,payment_completed,completed,round_closed"`
}
