package business

import (
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

	CreateBusinessParams
	shared.Timestamps
}

type CreateBusinessParams struct {
	Name           string         `json:"name"`
	BusinessNumber string         `json:"businessNumber"`
	FoundingDate   time.Time      `json:"foundingDate" format:"date-time"`
	OwnerAccountID int            `json:"ownerAccountId" minimum:"1"`
	Status         BusinessStatus `json:"status" enum:"pending,active,disabled"`
}
