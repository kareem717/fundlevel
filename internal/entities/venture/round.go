package venture

import (
	"fundlevel/internal/entities/shared"

	"github.com/uptrace/bun"
)

// VentureRounds represents the minified data of a round entity that is related to a venture.
type VentureRound struct {
	bun.BaseModel `bun:"table:rounds"`

	shared.IntegerID
	VentureID         int             `json:"ventureId" minimum:"1"`
	PercentageOffered float64         `json:"percentageOffered" minimum:"0" maximum:"100"`
	PercentageValue   int             `json:"percentageValue" minimum:"1"`
	ValueCurrency     shared.Currency `json:"valueCurrency" enum:"usd,gbp,eur,cad,aud,jpy"`
	InvestorCount     int             `json:"investorCount" minimum:"1"`
	BuyIn             float64         `json:"buyIn" minimum:"1"`
}
