package business

import (
	"fundlevel/internal/entities/shared"

	"github.com/uptrace/bun"
)

type BusinessMemberRole string

const (
	BusinessMemberRoleAdmin  BusinessMemberRole = "admin"
	BusinessMemberRoleMember BusinessMemberRole = "member"
)

type BusinessMember struct {
	bun.BaseModel `bun:"table:business_members"`

	CreateBusinessMemberParams
	shared.DeletableTimestamps
}

type CreateBusinessMemberParams struct {
	BusinessID int `json:"businessId" minimum:"1"`
	AccountID  int `json:"accountId" minimum:"1"`
	UpdateBusinessMemberParams
}

type UpdateBusinessMemberParams struct {
	Role BusinessMemberRole `json:"role" enum:"admin,member"`
}
