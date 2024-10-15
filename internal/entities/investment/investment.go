package investment

import (
	"time"

	"fundlevel/internal/entities/account"
	"fundlevel/internal/entities/round"
	"fundlevel/internal/entities/shared"

	"github.com/uptrace/bun"
)

type InvestmentStatus string

const (
	InvestmentStatusPending    InvestmentStatus = "pending"
	InvestmentStatusAccepted   InvestmentStatus = "accepted"
	InvestmentStatusRejected   InvestmentStatus = "rejected"
	InvestmentStatusWithdrawn  InvestmentStatus = "withdrawn"
	InvestmentStatusSuccessful InvestmentStatus = "successful"
	InvestmentStatusFailed     InvestmentStatus = "failed"
)

// FixedTotalRound represents an fixed total round entity.
type RoundInvestment struct {
	bun.BaseModel `bun:"table:round_investments"`
	shared.IntegerID
	CreateInvestmentParams
	UpdateInvestmentParams
	Round    *round.Round     `json:"round" bun:"rel:belongs-to,join:round_id=id" readonly:"true"`
	Investor *account.Account `json:"investor" bun:"rel:belongs-to,join:investor_id=id" readonly:"true"`
	shared.Timestamps
}

type CreateInvestmentParams struct {
	RoundID    int `json:"roundId"`
	InvestorID int `json:"investorId"`
}

type UpdateInvestmentParams struct {
	Status                  InvestmentStatus `json:"status" enum:"pending,accepted,rejected,withdrawn,successful,failed" readOnly:"true"`
	StripeCheckoutSessionID *string          `json:"stripeCheckoutSessionId" readOnly:"true"`
	PaidAt                  *time.Time       `json:"paidAt" readOnly:"true"`
}
