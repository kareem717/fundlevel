package business

import (
	"fundlevel/internal/entities/address"
	"fundlevel/internal/entities/shared"
	"time"

	"github.com/uptrace/bun"
)

type BusinessStatus string

const (
	BusinessStatusPending  BusinessStatus = "pending"
	BusinessStatusActive   BusinessStatus = "active"
	BusinessStatusDisabled BusinessStatus = "disabled"
)

type Business struct {
	bun.BaseModel `bun:"table:businesses"`
	shared.IntegerID

	Address *address.Address `json:"address" bun:"rel:has-one,join:address_id=id"`

	BusinessParams
	shared.Timestamps
}

type BusinessParams struct {
	Name           string         `json:"name"`
	BusinessNumber string         `json:"businessNumber"`
	FoundingDate   time.Time      `json:"foundingDate" format:"date-time"`
	OwnerAccountID int            `json:"ownerAccountId" minimum:"1"`
	Status         BusinessStatus `json:"status" enum:"pending,active,disabled"`
	AddressID      int            `json:"addressId" minimum:"1" hidden:"true"`
}
type CreateBusinessParams struct {
	Business BusinessParams        `json:"business"`
	Address  address.CreateAddressParams `json:"address"`
}
