package investment

import (
	// "fundlevel/internal/entities/account"
	// "fundlevel/internal/entities/round"
	"fundlevel/internal/entities/shared"

	"github.com/uptrace/bun"
)

type InvestmentIntentStatus string

const (
	InvestmentIntentStatusTerms         InvestmentIntentStatus = "awaiting_term_acceptance"
	InvestmentIntentStatusPayment       InvestmentIntentStatus = "awaiting_payment"
	InvestmentIntentStatusCompleted     InvestmentIntentStatus = "investor_tasks_completed"
	InvestmentIntentStatusFailedTerms   InvestmentIntentStatus = "failed_to_accept_terms"
	InvestmentIntentStatusFailedPayment InvestmentIntentStatus = "failed_to_make_payment"
	InvestmentIntentStatusWithdrawn     InvestmentIntentStatus = "investor_withdrew"
	InvestmentIntentStatusRejected      InvestmentIntentStatus = "business_rejected"
	InvestmentIntentStatusRoundClosed   InvestmentIntentStatus = "round_closed_before_investor_tasks_completed"
)

type InvestmentIntent struct {
	bun.BaseModel `bun:"table:investment_intents"`
	shared.IntegerID
	CreateInvestmentIntentParams
	IntentCompletedAt  *string `json:"intentCompletedAt,omitempty"`
	PaymentCompletedAt *string `json:"paymentCompletedAt,omitempty"`
	CompletedAt        *string `json:"completedAt,omitempty"`
	// Round              *round.Round     `json:"round" bun:"rel:belongs-to,join:round_id=id" required:"false"`
	// Investor           *account.Account `json:"investor" bun:"rel:belongs-to,join:investor_id=id" required:"false"`
	shared.Timestamps
}

type CreateInvestmentIntentParams struct {
	RoundID          int              `json:"roundId"`
	InvestorID       int              `json:"investorId"`
	Status           InvestmentIntentStatus `json:"status" enum:"intent,payment,completed,failed_terms,failed_payment,investor_withdrawn,business_rejected,round_closed"`
	AmountUSDCents   int32            `json:"amountUsdCents" min:"100"`
	RequiresApproval bool             `json:"requiresApproval"`
}

type UpdateInvestmentIntentParams struct {
	Status             InvestmentIntentStatus `json:"status" enum:"intent,payment,completed,failed_terms,failed_payment,investor_withdrawn,business_rejected,round_closed"`
	IntentCompletedAt  *string                `json:"intentCompletedAt,omitempty"`
	PaymentCompletedAt *string                `json:"paymentCompletedAt,omitempty"`
	CompletedAt        *string                `json:"completedAt,omitempty"`
}

type InvestmentIntentFilter struct {
	Status []string `query:"status" required:"false" enum:"intent,payment,completed,failed_terms,failed_payment,investor_withdrawn,business_rejected,round_closed"`

	SortBy    string `query:"sortBy" required:"false" enum:"created_at"`
	SortOrder string `query:"sortOrder" required:"false" enum:"asc,desc" default:"desc"`
}
