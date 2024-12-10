package investment

import (
	// "fundlevel/internal/entities/account"
	// "fundlevel/internal/entities/round"
	"fundlevel/internal/entities/shared"
	"time"

	"github.com/uptrace/bun"
)

type InvestmentStatus string

const (
	InvestmentStatusTerms         InvestmentStatus = "awaiting_term_acceptance"
	InvestmentStatusPayment       InvestmentStatus = "awaiting_payment"
	InvestmentStatusCompleted     InvestmentStatus = "investor_tasks_completed"
	InvestmentStatusFailedTerms   InvestmentStatus = "failed_to_accept_terms"
	InvestmentStatusFailedPayment InvestmentStatus = "failed_to_make_payment"
	InvestmentStatusWithdrawn     InvestmentStatus = "investor_withdrew"
	InvestmentStatusRejected      InvestmentStatus = "business_rejected"
	InvestmentStatusRoundClosed   InvestmentStatus = "round_closed_before_investor_tasks_completed"
)

type Investment struct {
	bun.BaseModel `bun:"table:investments"`
	shared.IntegerID
	CreateInvestmentParams
	TermsCompletedAt   *time.Time `json:"termsCompletedAt,omitempty"`
	PaymentCompletedAt *time.Time `json:"paymentCompletedAt,omitempty"`
	CompletedAt        *time.Time `json:"completedAt,omitempty"`
	AmountUSDCents     int        `json:"amountUsdCents" min:"100" hidden:"true" required:"false"`
	ApprovedAt         *time.Time `json:"approvedAt,omitempty"`
	// Round              *round.Round     `json:"round" bun:"rel:belongs-to,join:round_id=id" required:"false"`
	// Investor           *account.Account `json:"investor" bun:"rel:belongs-to,join:investor_id=id" required:"false"`
	Payments []InvestmentPayment `json:"payments" bun:"rel:has-many,join:id=investment_id" required:"false"`
	shared.Timestamps
}

type CreateInvestmentParams struct {
	RoundID          int              `json:"roundId"`
	InvestorID       int              `json:"investorId"`
	Status           InvestmentStatus `json:"status" enum:"awaiting_term_acceptance,awaiting_payment,investor_tasks_completed,failed_to_accept_terms,failed_to_make_payment,investor_withdrew,business_rejected,round_closed_before_investor_tasks_completed"`
	AmountUSDCents   int              `json:"amountUsdCents" min:"100" hidden:"true" required:"false"`
	RequiresApproval bool             `json:"requiresApproval"`
}

type UpdateInvestmentParams struct {
	Status             InvestmentStatus `json:"status" hidden:"true" required:"false" enum:"awaiting_term_acceptance,awaiting_payment,investor_tasks_completed,failed_to_accept_terms,failed_to_make_payment,investor_withdrew,business_rejected,round_closed_before_investor_tasks_completed"`
	TermsCompletedAt   *time.Time          `json:"termsCompletedAt,omitempty" hidden:"true" required:"false"`
	PaymentCompletedAt *time.Time          `json:"paymentCompletedAt,omitempty" hidden:"true" required:"false"`
	CompletedAt        *time.Time          `json:"completedAt,omitempty" hidden:"true" required:"false"`
	ApprovedAt         *time.Time          `json:"approvedAt,omitempty" hidden:"true" required:"false"`
}

type InvestmentFilter struct {
	Status []string `query:"status" required:"false" enum:"awaiting_term_acceptance,awaiting_payment,investor_tasks_completed,failed_to_accept_terms,failed_to_make_payment,investor_withdrew,business_rejected,round_closed_before_investor_tasks_completed"`

	SortBy    string `query:"sortBy" required:"false" enum:"created_at"`
	SortOrder string `query:"sortOrder" required:"false" enum:"asc,desc" default:"desc"`
}
