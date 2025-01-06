package business

import (
	"fundlevel/internal/entities/shared"

	"github.com/stripe/stripe-go/v80"
	"github.com/uptrace/bun"
)

type BusinessStripeAccount struct {
	bun.BaseModel `bun:"table:business_stripe_accounts"`

	BusinessID               int                                       `json:"businessId" minimum:"1" bun:",pk"`
	StripeConnectedAccountID string                                    `json:"stripeConnectedAccountId"`
	StripeDisabledReason     *stripe.AccountRequirementsDisabledReason `json:"stripeDisabledReason"`
	StripeTransfersEnabled   bool                                      `json:"stripeTransfersEnabled"`
	StripePayoutsEnabled     bool                                      `json:"stripePayoutsEnabled"`
	shared.Timestamps
}

type CreateBusinessStripeAccountParams struct {
	BusinessID               int    `json:"businessId" minimum:"1" bun:",pk"`
	StripeConnectedAccountID string `json:"stripeConnectedAccountId"`
	UpdateBusinessStripeAccountParams
}

type UpdateBusinessStripeAccountParams struct {
	StripeDisabledReason   *stripe.AccountRequirementsDisabledReason `json:"stripeDisabledReason" hidden:"true" required:"false"`
	StripeTransfersEnabled bool                                      `json:"stripeTransfersEnabled" hidden:"true" required:"false"`
	StripePayoutsEnabled   bool                                      `json:"stripePayoutsEnabled" hidden:"true" required:"false"`
}
