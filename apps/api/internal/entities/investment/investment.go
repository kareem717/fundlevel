package investment

import (
	"time"

	"fundlevel/internal/entities/round"
	"fundlevel/internal/entities/shared"

	"github.com/uptrace/bun"
)

type Investment struct {
	bun.BaseModel `bun:"table:investments"`
	shared.IntegerID

	RoundID            int        `json:"round_id" minimum:"1"`
	ShareQuantity      int        `json:"share_quantity" minimum:"1"`
	TermsAcceptanceID  int        `json:"terms_acceptance_id" minimum:"1"`
	InvestorID         int        `json:"investor_id" minimum:"1"`
	UsdCentValue       int64      `json:"usd_cent_value" minimum:"1"`
	CompletedAt        *time.Time `json:"completed_at" format:"date-time"`

	shared.Timestamps
}

type CreateInvestmentParams struct {
	Investment struct {
		bun.BaseModel `bun:"table:investments"`

		RoundID       int `json:"round_id" minimum:"1"`
		ShareQuantity int `json:"share_quantity" minimum:"1"`
	} `json:"investment"`
	TermsAcceptance round.CreateRoundTermsAcceptanceParams `json:"terms_acceptance"`
}

type UpdateInvestmentParams struct {
	CompletedAt *time.Time `json:"completed_at" format:"date-time"`
}
