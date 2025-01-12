package position

import (
	"fundlevel/internal/entities/shared"

	"github.com/uptrace/bun"
)

type Position struct {
	bun.BaseModel `bun:"table:positions"`

	shared.IntegerID
	InvestmentID int `json:"investment_id"`
	shared.Timestamps
}

type CreatePositionParams struct {
	bun.BaseModel `bun:"table:positions,alias:position"`

	InvestmentID int `json:"investment_id"`
}
