package investment

import (
	"fundlevel/internal/entities/account"
	"fundlevel/internal/entities/round"
	"fundlevel/internal/entities/shared"

	"github.com/uptrace/bun"
)

type InvestmentStatus string

const (
	InvestmentStatusPending     InvestmentStatus = "pending"
	InvestmentStatusProcessing  InvestmentStatus = "processing"
	InvestmentStatusRejected    InvestmentStatus = "rejected"
	InvestmentStatusWithdrawn   InvestmentStatus = "withdrawn"
	InvestmentStatusSuccessful  InvestmentStatus = "successful"
	InvestmentStatusRoundClosed InvestmentStatus = "round_closed"
)

// FixedTotalRound represents an fixed total round entity.
type RoundInvestment struct {
	bun.BaseModel `bun:"table:round_investments"`
	shared.IntegerID
	CreateInvestmentParams
	Status   InvestmentStatus        `json:"status" enum:"pending,processing,rejected,withdrawn,successful,round_closed"`
	Payment  *RoundInvestmentPayment `json:"payment" bun:"rel:has-one,join:id=round_investment_id" required:"true"`
	Round    *round.Round            `json:"round" bun:"rel:belongs-to,join:round_id=id" required:"false"`
	Investor *account.Account        `json:"investor" bun:"rel:belongs-to,join:investor_id=id" required:"false"`
	shared.Timestamps
}

type CreateInvestmentParams struct {
	RoundID    int              `json:"roundId"`
	InvestorID int              `json:"investorId"`
	Status     InvestmentStatus `json:"status" enum:"pending,processing,rejected,withdrawn,successful,round_closed"`
}

type UpdateInvestmentParams struct {
	Status InvestmentStatus `json:"status" enum:"pending,processing,rejected,withdrawn,successful,round_closed"`
}

type InvestmentFilter struct {
	Status []string `query:"status" required:"false" enum:"pending,processing,rejected,withdrawn,successful,round_closed"`

	SortBy    string `query:"sortBy" required:"false" enum:"created_at"`
	SortOrder string `query:"sortOrder" required:"false" enum:"asc,desc" default:"desc"`
}
