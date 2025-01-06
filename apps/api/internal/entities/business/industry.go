package business

import (
	"fundlevel/internal/entities/industry"
	"time"

	"github.com/uptrace/bun"
)

type BusinessIndustries struct {
	bun.BaseModel `json:"-" bun:"business_industries"`

	BusinessID int                `json:"businessId" minimum:"1" bun:",pk"`
	Business   *Business          `json:"business" bun:"rel:belongs-to,join:business_id=id"`
	IndustryID int                `json:"industryId" minimum:"1" bun:",pk"`
	Industry   *industry.Industry `json:"industry" bun:"rel:belongs-to,join:industry_id=id"`

	CreatedAt time.Time `json:"createdAt" format:"date-time"`
}
