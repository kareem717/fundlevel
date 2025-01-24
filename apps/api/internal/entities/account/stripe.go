package account

import (
	"fundlevel/internal/entities/shared"

	"github.com/uptrace/bun"
)

type StripeIdentityStatus string

const (
	StripeIdentityStatusVerified StripeIdentityStatus = "verified"
	StripeIdentityStatusCanceled StripeIdentityStatus = "canceled"
)

func (s StripeIdentityStatus) IsValid() bool {
	switch s {
	case StripeIdentityStatusVerified, StripeIdentityStatusCanceled:
		return true
	default:
		return false
	}
}

type StripeIdentity struct {
	bun.BaseModel `bun:"table:stripe_identities"`

	AccountID int                  `json:"account_id" minimum:"1"`
	Status    StripeIdentityStatus `json:"status" enum:"verified,canceled"`
	RemoteID  string               `json:"remote_id" minimum:"1"`

	shared.BasicTimestamps
}

type CreateStripeIdentityParams struct {
	bun.BaseModel `bun:"table:stripe_identities"`

	Status   StripeIdentityStatus
	RemoteID string
}
