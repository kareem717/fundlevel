package business

import (
	"fundlevel/internal/entities/account"
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

type BusinessMemberRole struct {
	bun.BaseModel `bun:"business_member_roles"`

	ID          int              `json:"id" bun:",pk"`
	Name        string           `json:"name"`
	Permissions []RolePermission `json:"permissions" bun:"rel:has-many,join:id=role_id"`
	shared.Timestamps
}

type BusinessMember struct {
	bun.BaseModel `json:"-" bun:"business_members"`
	BusinessId    int `json:"businessId" bun:",pk"`
	AccountId     int `json:"accountId" bun:",pk"`
	RoleId        int `json:"roleId"`

	shared.Timestamps
}

type BusinessMemberWithRole struct {
	bun.BaseModel `json:"-" bun:"business_members,alias:business_member"`
	BusinessMember
	Role BusinessMemberRole `bun:"rel:has-one,join:role_id=id"`
}

type BusinessMemberWithRoleNameAndAccount struct {
	bun.BaseModel `json:"-" bun:"business_members,alias:business_member"`
	BusinessMember
	Role    string              `json:"role" description:"The name of the role of the member"`
	Account account.SafeAccount `json:"account" bun:"rel:has-one,join:account_id=id"`
}

type CreateBusinessMemberParams struct {
	BusinessId int `json:"businessId" minimum:"1"`
	AccountId  int `json:"accountId" minimum:"1"`
	RoleId     int `json:"roleId" minimum:"1"`
}
