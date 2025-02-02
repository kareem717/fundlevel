package investment

import (
	"fundlevel/internal/entities/shared"
	"time"

	"github.com/uptrace/bun"
)

type InvestmentStatus string

const (
	InvestmentStatusAwaitingConfirmation InvestmentStatus = "awaiting_confirmation"
	InvestmentStatusAwaitingPayment      InvestmentStatus = "awaiting_payment"
	InvestmentStatusPaymentCompleted     InvestmentStatus = "payment_completed"
	InvestmentStatusCompleted            InvestmentStatus = "completed"
	InvestmentStatusRoundClosed          InvestmentStatus = "round_closed"
)

type Investment struct {
	bun.BaseModel `bun:"table:investments"`
	shared.IntegerID

	RoundID           int              `json:"round_id" minimum:"1"`
	ShareQuantity     int              `json:"share_quantity" minimum:"1"`
	InvestorID        int              `json:"investor_id" minimum:"1"`
	Status            InvestmentStatus `json:"status" enum:"awaiting_confirmation,awaiting_payment,payment_completed,completed,round_closed"`
	TotalUSDCentValue int              `json:"total_usd_cent_value" minimum:"1"`
	TermAcceptance
	shared.Timestamps
}

type CreateInvestmentParams struct {
	bun.BaseModel `bun:"table:investments"`

	RoundID       int `json:"round_id" minimum:"1"`
	ShareQuantity int `json:"share_quantity" minimum:"1"`
	TermAcceptance
}

type UpdateInvestmentParams struct {
	bun.BaseModel `bun:"table:investments,alias:investment"`

	ShareQuantity *int `json:"share_quantity" minimum:"1"`
	*TermAcceptance
	Status *InvestmentStatus `json:"status" enum:"awaiting_confirmation,awaiting_payment,payment_completed,completed,round_closed" hidden:"true" required:"false"`
}

type TermAcceptance struct {
	TermsID                  int       `json:"terms_id" minimum:"1"`
	TermsAcceptedAt          time.Time `json:"terms_accepted_at"`
	TermsAcceptanceIPAddress string    `json:"terms_acceptance_ip_address"`
	TermsAcceptanceUserAgent string    `json:"terms_acceptance_user_agent"`
}

// Aggregate represents a single aggregate of investments by date-time.
type Aggregate struct {
	Date          time.Time `json:"date"`
	ValueUSDCents int64     `json:"value_usd_cents" minimum:"0"`
}
