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

type TeamSize string

const (
	TeamSize0_1      TeamSize = "0-1"
	TeamSize2_10     TeamSize = "2-10"
	TeamSize11_50    TeamSize = "11-50"
	TeamSize51_200   TeamSize = "51-200"
	TeamSize201_500  TeamSize = "201-500"
	TeamSize501_1000 TeamSize = "501-1000"
	TeamSize1000Plus TeamSize = "1000+"
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
	TeamSize       TeamSize       `json:"teamSize" enum:"0-1,2-10,11-50,51-200,201-500,501-1000,1000+"`
	IsRemote       bool           `json:"isRemote" default:"false"`
}

type CreateBusinessParams struct {
	Business BusinessParams              `json:"business"`
	Address  address.CreateAddressParams `json:"address"`
}