package business

import (
	"fundlevel/internal/entities/shared"

	"github.com/uptrace/bun"
)

type BusinessLegalSection struct {
	bun.BaseModel `bun:"table:business_legal_section"`
	shared.IntegerID
	BusinessNumber string `json:"businessNumber"`
	shared.BasicTimestamps
}

type UpsertBusinessLegalSectionParams struct {
	bun.BaseModel  `bun:"table:business_legal_section"`
	BusinessNumber string `json:"businessNumber" minLength:"1" maxLength:"10"`
}
