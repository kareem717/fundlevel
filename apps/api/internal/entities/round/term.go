package round

import (
	"fundlevel/internal/entities/shared"
	"time"

	"github.com/uptrace/bun"
)

type RoundTerm struct {
	bun.BaseModel `bun:"table:round_terms"`

	shared.IntegerID
	Content string `json:"content" minLength:"10" maxLength:"3000"`

	shared.Timestamps
}

type CreateRoundTermParams struct {
	bun.BaseModel `bun:"table:round_terms"`
	Content string `json:"content" minLength:"10" maxLength:"3000"`
}

type RoundTermsAcceptance struct {
	bun.BaseModel `bun:"table:round_terms_acceptances"`

	shared.IntegerID
	TermsID    int       `json:"terms_id" minimum:"1"`
	AcceptedAt time.Time `json:"accepted_at"`
	IPAddress  string    `json:"ip_address" minLength:"1" maxLength:"45"`
	UserAgent  string    `json:"user_agent" minLength:"1" maxLength:"500"`

	shared.Timestamps
}

type CreateRoundTermsAcceptanceParams struct {
	bun.BaseModel `bun:"table:round_terms_acceptances"`

	TermsID    int       `json:"terms_id" minimum:"1"`
	AcceptedAt time.Time `json:"accepted_at"`
	IPAddress  string    `json:"ip_address" minLength:"1" maxLength:"45"`
	UserAgent  string    `json:"user_agent" minLength:"1" maxLength:"500"`
}
