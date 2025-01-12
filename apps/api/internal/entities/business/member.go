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
	shared.IntegerID
	Value       RolePermissionValue `json:"value"`
	Description string              `json:"description"`
}

type BusinessMemberRoleName string

const (
	BusinessMemberRoleNameOwner  BusinessMemberRoleName = "owner"
	BusinessMemberRoleNameAdmin  BusinessMemberRoleName = "admin"
	BusinessMemberRoleNameMember BusinessMemberRoleName = "member"
)

type BusinessMemberRole struct {
	bun.BaseModel `bun:"business_member_roles"`

	shared.IntegerID
	Name        BusinessMemberRoleName `json:"name"`
	Description string                 `json:"description"`
	// Many-to-many relationship with permissions through the assignments table
	Permissions []RolePermission `json:"permissions" bun:"m2m:business_member_role_permission_assignments,join:Role=Permission"`
}

type BusinessMemberRolePermissionAssignment struct {
	bun.BaseModel `bun:"business_member_role_permission_assignments"`
	RoleID        int                 `json:"role_id" minimum:"1" bun:",pk"`
	Role          *BusinessMemberRole `json:"role" bun:"rel:belongs-to,join:role_id=id"`
	PermissionID  int                 `json:"permission_id" minimum:"1" bun:",pk"`
	Permission    *RolePermission     `json:"permission" bun:"rel:belongs-to,join:permission_id=id"`
}

type BusinessMember struct {
	bun.BaseModel `json:"-" bun:"business_members"`
	BusinessId    int `json:"business_id" bun:",pk"`
	AccountId     int `json:"account_id" bun:",pk"`
	RoleId        int `json:"role_id"`

	// Define the belongs-to relationships
	Role    *BusinessMemberRole  `json:"role" bun:"rel:belongs-to,join:role_id=id"`
	Account *account.SafeAccount `json:"account" bun:"rel:belongs-to,join:account_id=id"`
	shared.Timestamps
}

type BusinessMemberWithRole struct {
	bun.BaseModel `json:"-" bun:"business_members,alias:business_member"`
	BusinessMember
	Role BusinessMemberRole `json:"role" bun:"rel:belongs-to,join:role_id=id"`
}

type BusinessMemberWithRoleNameAndAccount struct {
	bun.BaseModel `json:"-" bun:"business_members,alias:business_member"`
	BusinessMember
	Role    string              `json:"role" description:"The name of the role of the member"`
	Account account.SafeAccount `json:"account" bun:"rel:belongs-to,join:account_id=id"`
}

type CreateBusinessMemberParams struct {
	BusinessId int `json:"business_id" minimum:"1"`
	AccountId  int `json:"account_id" minimum:"1"`
	RoleId     int `json:"role_id" minimum:"1"`
}
