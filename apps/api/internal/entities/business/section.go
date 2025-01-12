package business

import (
	"fundlevel/internal/entities/shared"

	"github.com/uptrace/bun"
)

type BusinessLegalSection struct {
	bun.BaseModel `bun:"table:business_legal_section"`
	shared.IntegerID
	BusinessNumber string `json:"business_number"`
	shared.BasicTimestamps
}

type UpsertBusinessLegalSectionParams struct {
	bun.BaseModel  `bun:"table:business_legal_section"`
	BusinessNumber string `json:"business_number" minLength:"1" maxLength:"10"`
}
