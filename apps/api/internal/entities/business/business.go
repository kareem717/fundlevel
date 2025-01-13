package business

import (
	"fundlevel/internal/entities/industry"
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

type EmployeeCountRange string

const (
	EmployeeCountRange1        EmployeeCountRange = "1"
	EmployeeCountRange2_10     EmployeeCountRange = "2-10"
	EmployeeCountRange11_50    EmployeeCountRange = "11-50"
	EmployeeCountRange51_200   EmployeeCountRange = "51-200"
	EmployeeCountRange201_500  EmployeeCountRange = "201-500"
	EmployeeCountRange501_1000 EmployeeCountRange = "501-1000"
	EmployeeCountRange1000Plus EmployeeCountRange = "1000+"
)

type Business struct {
	bun.BaseModel `bun:"table:businesses"`
	shared.IntegerID

	StripeAccount *BusinessStripeAccount `json:"stripe_account" bun:"rel:has-one,join:id=business_id"`
	Legal         *BusinessLegalSection  `json:"business_legal_section" bun:"rel:has-one,join:business_legal_section_id=id"`

	BusinessLegalSectionID *int                `json:"business_legal_section_id" minimum:"1" required:"false"`
	DisplayName            string              `json:"display_name" minLength:"1"`
	FoundingDate           time.Time           `json:"founding_date" format:"date-time"`
	Status                 BusinessStatus      `json:"status" hidden:"true" required:"false"`
	EmployeeCount          EmployeeCountRange  `json:"employee_count" enum:"1,2-10,11-50,51-200,201-500,501-1000,1000+" required:"false"`
	Industries             []industry.Industry `json:"industries" bun:"m2m:business_industries,join:Business=Industry"`
	shared.Timestamps
}

type BusinessParams struct {
	*string       `json:"business_colour" minLength:"7" maxLength:"7" regex:"^#[0-9A-F]{6}$" required:"false" example:"#E9743E"`
	DisplayName   string             `json:"display_name" minLength:"1" example:"Acme Inc."`
	FoundingDate  time.Time          `json:"founding_date" format:"date-time"`
	Status        BusinessStatus     `json:"status" hidden:"true" required:"false"`
	EmployeeCount EmployeeCountRange `json:"employee_count" enum:"1,2-10,11-50,51-200,201-500,501-1000,1000+"`
}

type CreateBusinessParams struct {
	Business      BusinessParams                    `json:"business"`
	StripeAccount CreateBusinessStripeAccountParams `json:"stripe_account" required:"false" hidden:"true"`
	IndustryIDs   []int                             `json:"industry_ids" required:"false" minItems:"1" type:"array" uniqueItems:"true" example:"[1]"`
}

type UpdateBusinessParams struct {
	DisplayName   *string             `json:"display_name" minLength:"1" required:"false"`
	Status        *BusinessStatus     `json:"status" hidden:"true" required:"false"`
	EmployeeCount *EmployeeCountRange `json:"employee_count" enum:"1,2-10,11-50,51-200,201-500,501-1000,1000+" required:"false"`
}
