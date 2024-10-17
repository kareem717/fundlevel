package industry

import (
	"fundlevel/internal/entities/shared"

	"github.com/uptrace/bun"
)

// Industry represents an industry entity.
type Industry struct {
	bun.BaseModel `bun:"table:industries"`

	shared.IntegerID
	CreateIndustryParams
	shared.Timestamps
}

// CreateIndustryParams contains the parameters for creating a new industry.
type CreateIndustryParams struct {
	Label string `json:"label" minLength:"3" maxLength:"30"`
}

// UpdateIndustryParams contains the parameters for updating an industry.
type UpdateIndustryParams struct {
	Label string `json:"label" minLength:"3" maxLength:"30"`
}
