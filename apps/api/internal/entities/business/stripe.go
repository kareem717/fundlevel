package business

import (
	"fundlevel/internal/entities/shared"

	"github.com/stripe/stripe-go/v81"
	"github.com/uptrace/bun"
)

type BusinessStripeAccount struct {
	bun.BaseModel `bun:"table:business_stripe_accounts"`

	BusinessID               int                                       `json:"business_id" minimum:"1" bun:",pk"`
	StripeConnectedAccountID string                                    `json:"stripe_connected_account_id"`
	StripeDisabledReason     *stripe.AccountRequirementsDisabledReason `json:"stripe_disabled_reason"`
	StripeTransfersEnabled   bool                                      `json:"stripe_transfers_enabled"`
	StripePayoutsEnabled     bool                                      `json:"stripe_payouts_enabled"`
	shared.Timestamps
}

type CreateBusinessStripeAccountParams struct {
	BusinessID               int    `json:"business_id" minimum:"1" bun:",pk"`
	StripeConnectedAccountID string `json:"stripe_connected_account_id"`
	UpdateBusinessStripeAccountParams
}

type UpdateBusinessStripeAccountParams struct {
	StripeDisabledReason   *stripe.AccountRequirementsDisabledReason `json:"stripe_disabled_reason" hidden:"true" required:"false"`
	StripeTransfersEnabled bool                                      `json:"stripe_transfers_enabled" hidden:"true" required:"false"`
	StripePayoutsEnabled   bool                                      `json:"stripe_payouts_enabled" hidden:"true" required:"false"`
}
