package investment

import (
	"fundlevel/internal/entities/round"
	"fundlevel/internal/entities/shared"

	"github.com/uptrace/bun"
)

type InvestmentStatus string

const (
	InvestmentStatusAwaitingPayment              InvestmentStatus = "awaiting_payment"
	InvestmentStatusPaymentCompleted             InvestmentStatus = "payment_completed"
	InvestmentStatusCompleted                    InvestmentStatus = "completed"
)

type InvestmentStatusField struct {
}

type Investment struct {
	bun.BaseModel `bun:"table:investments"`
	shared.IntegerID

	RoundID           int              `json:"round_id" minimum:"1"`
	ShareQuantity     int              `json:"share_quantity" minimum:"1"`
	TermsAcceptanceID int              `json:"terms_acceptance_id" minimum:"1"`
	InvestorID        int              `json:"investor_id" minimum:"1"`
	Status            InvestmentStatus `json:"status" enum:"awaiting_payment,payment_completed,completed"`
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
	bun.BaseModel `bun:"table:investments,alias:investment"`

	Status *InvestmentStatus `json:"status" enum:"awaiting_payment,payment_completed,completed"`
}
