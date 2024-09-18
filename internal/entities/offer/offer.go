package offer

import (
	"fundlevel/internal/entities/shared"

	"github.com/uptrace/bun"
)

// OfferStatus represents the status of an offer.
type OfferStatus string 

const (
	OfferStatusPending   OfferStatus = "pending" 	
	OfferStatusAccepted  OfferStatus = "accepted"
	OfferStatusRejected  OfferStatus = "rejected"
	OfferStatusWithdrawn OfferStatus = "withdrawn"
)

// Offer represents an offer entity.
type Offer struct {
	bun.BaseModel `bun:"table:offers"`
	shared.IntegerID
	CreateOfferParams
	UpdateOfferParams
	shared.Timestamps
}

// CreateOfferParams contains the parameters for creating a new offer.
type CreateOfferParams struct {
	RoundID          int     `json:"roundId" minimum:"1"`
	OffererAccountID int     `json:"offererAccountId" minimum:"1"`
	PercentageAmount float64 `json:"percentageAmount" minimum:"0" maximum:"100"`
	USDAmount        float64 `json:"usdAmount" minimum:"0" maximum:"9999999999.99"`
}

// UpdateOfferParams contains the parameters for updating an offer.
type UpdateOfferParams struct {
	Status OfferStatus `json:"status" enum:"pending,accepted,rejected,withdrawn"`
}
