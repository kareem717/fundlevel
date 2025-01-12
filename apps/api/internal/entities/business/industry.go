package business

import (
	"fundlevel/internal/entities/industry"
	"time"

	"github.com/uptrace/bun"
)

type BusinessIndustries struct {
	bun.BaseModel `json:"-" bun:"business_industries"`

	BusinessID int                `json:"business_id" minimum:"1" bun:",pk"`
	Business   *Business          `json:"business" bun:"rel:belongs-to,join:business_id=id"`
	IndustryID int                `json:"industry_id" minimum:"1" bun:",pk"`
	Industry   *industry.Industry `json:"industry" bun:"rel:belongs-to,join:industry_id=id"`

	CreatedAt time.Time `json:"created_at" format:"date-time"`
}
