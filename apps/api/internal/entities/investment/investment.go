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
	InvestmentStatusTerms            InvestmentStatus = "awaiting_term_acceptance"
	InvestmentStatusAwaitingApproval InvestmentStatus = "awaiting_approval"
	InvestmentStatusPayment          InvestmentStatus = "awaiting_payment"
	InvestmentStatusCompleted        InvestmentStatus = "investor_tasks_completed"
	InvestmentStatusFailedTerms      InvestmentStatus = "failed_to_accept_terms"
	InvestmentStatusFailedPayment    InvestmentStatus = "failed_to_make_payment"
	InvestmentStatusWithdrawn        InvestmentStatus = "investor_withdrew"
	InvestmentStatusRejected         InvestmentStatus = "business_rejected"
	InvestmentStatusRoundClosed      InvestmentStatus = "round_closed_before_investor_tasks_completed"
)

type Investment struct {
	bun.BaseModel `bun:"table:investments"`
	shared.IntegerID
	CreateInvestmentParams
	InvestorID         int                 `json:"investor_id"`
	TermsCompletedAt   *time.Time          `json:"terms_completed_at,omitempty"`
	PaymentCompletedAt *time.Time          `json:"payment_completed_at,omitempty"`
	CompletedAt        *time.Time          `json:"completed_at,omitempty"`
	ShareQuantity      int                 `json:"share_quantity" min:"1"`
	ApprovedAt         *time.Time          `json:"approved_at,omitempty"`
	Payments           []InvestmentPayment `json:"payments" bun:"rel:has-many,join:id=investment_id" required:"false"`
	shared.Timestamps
}

type CreateInvestmentParams struct {
	RoundID                int              `json:"round_id"`
	ShareQuantity          int              `json:"share_quantity" min:"1"`
	Status                 InvestmentStatus `json:"status" hidden:"true" required:"false" enum:"awaiting_term_acceptance,awaiting_payment,investor_tasks_completed,failed_to_accept_terms,failed_to_make_payment,investor_withdrew,business_rejected,round_closed_before_investor_tasks_completed"`
	RequiresManualApproval bool             `json:"requires_manual_approval" hidden:"true" required:"false"`
}

type UpdateInvestmentParams struct {
	Status             InvestmentStatus `json:"status" hidden:"true" required:"false" enum:"awaiting_term_acceptance,awaiting_payment,investor_tasks_completed,failed_to_accept_terms,failed_to_make_payment,investor_withdrew,business_rejected,round_closed_before_investor_tasks_completed"`
	TermsCompletedAt   *time.Time       `json:"terms_completed_at,omitempty" hidden:"true" required:"false"`
	PaymentCompletedAt *time.Time       `json:"payment_completed_at,omitempty" hidden:"true" required:"false"`
	CompletedAt        *time.Time       `json:"completed_at,omitempty" hidden:"true" required:"false"`
	ApprovedAt         *time.Time       `json:"approved_at,omitempty" hidden:"true" required:"false"`
}

type InvestmentFilter struct {
	Status []string `query:"status" required:"false" enum:"awaiting_term_acceptance,awaiting_payment,investor_tasks_completed,failed_to_accept_terms,failed_to_make_payment,investor_withdrew,business_rejected,round_closed_before_investor_tasks_completed"`

	SortBy    string `query:"sort_by" required:"false" enum:"created_at"`
	SortOrder string `query:"sort_order" required:"false" enum:"asc,desc" default:"desc"`
}
