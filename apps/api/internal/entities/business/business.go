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

	StripeAccount *BusinessStripeAccount `json:"stripeAccount" bun:"rel:has-one,join:id=business_id"`
	Legal         *BusinessLegalSection  `json:"businessLegalSection" bun:"rel:has-one,join:business_legal_section_id=id"`

	BusinessLegalSectionID *int                `json:"businessLegalSectionId" minimum:"1" required:"false"`
	BusinessColour         string              `json:"businessColour"`
	DisplayName            string              `json:"displayName" minLength:"1"`
	FoundingDate           time.Time           `json:"foundingDate" format:"date-time"`
	Status                 BusinessStatus      `json:"status" hidden:"true" required:"false"`
	EmployeeCount          EmployeeCountRange  `json:"employeeCount" enum:"1,2-10,11-50,51-200,201-500,501-1000,1000+" required:"false"`
	Industries             []industry.Industry `json:"industries" bun:"m2m:business_industries,join:Business=Industry"`
	shared.Timestamps
}

type BusinessParams struct {
	BusinessColour *string            `json:"businessColour" minLength:"7" maxLength:"7" regex:"^#[0-9A-F]{6}$" required:"false" example:"#E9743E"`
	DisplayName    string             `json:"displayName" minLength:"1" example:"Acme Inc."`
	FoundingDate   time.Time          `json:"foundingDate" format:"date-time"`
	Status         BusinessStatus     `json:"status" hidden:"true" required:"false"`
	EmployeeCount  EmployeeCountRange `json:"employeeCount" enum:"1,2-10,11-50,51-200,201-500,501-1000,1000+"`
}

type CreateBusinessParams struct {
	Business       BusinessParams                    `json:"business"`
	StripeAccount  CreateBusinessStripeAccountParams `json:"stripeAccount" required:"false" hidden:"true"`
	IndustryIDs    []int                             `json:"industryIds" required:"false" minItems:"1" type:"array" uniqueItems:"true" example:"[1]"`
}

type UpdateBusinessParams struct {
	DisplayName    *string             `json:"displayName" minLength:"1" required:"false"`
	Status         *BusinessStatus     `json:"status" hidden:"true" required:"false"`
	EmployeeCount  *EmployeeCountRange `json:"employeeCount" enum:"1,2-10,11-50,51-200,201-500,501-1000,1000+" required:"false"`
	BusinessColour *string             `json:"businessColour" minLength:"6" maxLength:"6" regex:"^#[0-9A-F]{6}$" required:"false"`
}
