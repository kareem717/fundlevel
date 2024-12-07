package business

import (
	"fundlevel/internal/entities/shared"

	"github.com/uptrace/bun"
)

type RolePermissionValue string

const (
	RolePermissionValueBusinessFullAccess RolePermissionValue = "full_access"
)

type RolePermission struct {
	bun.BaseModel `bun:"business_member_role_permissions"`
	RoleId        int                 `json:"roleId" minimum:"1"`
	Value         RolePermissionValue `json:"value"`
}

type RoleType string

const (
	RoleTypeBusiness RoleType = "business"
)

type BusinessMemberRole struct {
	bun.BaseModel `bun:"business_member_roles"`

	ID          int              `json:"id" bun:",pk"`
	Name        string           `json:"name"`
	Permissions []RolePermission `json:"permissions" bun:"rel:has-many,join:id=role_id"`
	shared.Timestamps
}

type BusinessMember struct {
	bun.BaseModel `json:"-" bun:"business_members"`
	BusinessId    int `bun:",pk"`
	AccountId     int `bun:",pk"`
	RoleId        int

	Role BusinessMemberRole `bun:"rel:has-one,join:role_id=id"`
	shared.Timestamps
}
