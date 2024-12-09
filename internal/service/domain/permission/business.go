package permission

import (
	"context"
	"errors"
	"fundlevel/internal/entities/business"
)

func (s *PermissionService) CanAccountDeleteBusiness(ctx context.Context, accountId int, businessId int) (bool, error) {
	if accountId == 0 {
		return false, errors.New("account id is 0")
	}

	if businessId == 0 {
		return false, errors.New("business id is 0")
	}

	member, err := s.repo.Business().GetBusinessMember(ctx, businessId, accountId)
	if err != nil {
		return false, err
	}

	for _, permission := range member.Role.Permissions {
		switch permission.Value {
		case business.RolePermissionValueBusinessFullAccess:
			return true, nil
		}
	}

	return false, nil
}

func (s *PermissionService) CanAccessBusinessInvestments(ctx context.Context, accountId int, businessId int) (bool, error) {
	if accountId == 0 {
		return false, errors.New("account id is 0")
	}

	if businessId == 0 {
		return false, errors.New("business id is 0")
	}

	member, err := s.repo.Business().GetBusinessMember(ctx, businessId, accountId)
	if err != nil {
		return false, err
	}

	for _, permission := range member.Role.Permissions {
		switch permission.Value {
		case business.RolePermissionValueBusinessFullAccess:
			return true, nil
		}
	}

	return false, nil
}

func (s *PermissionService) CanAccessBusinessStripeDashboard(ctx context.Context, accountId int, businessId int) (bool, error) {
	if accountId == 0 {
		return false, errors.New("account id is 0")
	}

	if businessId == 0 {
		return false, errors.New("business id is 0")
	}

	member, err := s.repo.Business().GetBusinessMember(ctx, businessId, accountId)
	if err != nil {
		return false, err
	}

	for _, permission := range member.Role.Permissions {
		switch permission.Value {
		case business.RolePermissionValueBusinessFullAccess:
			return true, nil
		}
	}

	return false, nil
}

func (s *PermissionService) CanManageBusinessStripe(ctx context.Context, accountId int, businessId int) (bool, error) {
	if accountId == 0 {
		return false, errors.New("account id is 0")
	}

	if businessId == 0 {
		return false, errors.New("business id is 0")
	}

	member, err := s.repo.Business().GetBusinessMember(ctx, businessId, accountId)
	if err != nil {
		return false, err
	}

	for _, permission := range member.Role.Permissions {
		switch permission.Value {
		case business.RolePermissionValueBusinessFullAccess:
			return true, nil
		}
	}

	return false, nil
}

func (s *PermissionService) CanViewBusinessAnalytics(ctx context.Context, accountId int, businessId int) (bool, error) {
	if accountId == 0 {
		return false, errors.New("account id is 0")
	}

	if businessId == 0 {
		return false, errors.New("business id is 0")
	}

	member, err := s.repo.Business().GetBusinessMember(ctx, businessId, accountId)
	if err != nil {
		return false, err
	}

	for _, permission := range member.Role.Permissions {
		switch permission.Value {
		case business.RolePermissionValueBusinessFullAccess:
			return true, nil
		}
	}

	return false, nil
}

func (s *PermissionService) CanViewRoundAnalytics(ctx context.Context, accountId int, businessId int) (bool, error) {
	if accountId == 0 {
		return false, errors.New("account id is 0")
	}

	if businessId == 0 {
		return false, errors.New("business id is 0")
	}

	member, err := s.repo.Business().GetBusinessMember(ctx, businessId, accountId)
	if err != nil {
		return false, err
	}

	for _, permission := range member.Role.Permissions {
		switch permission.Value {
		case business.RolePermissionValueBusinessFullAccess:
			return true, nil
		}
	}

	return false, nil
}

func (s *PermissionService) CanCreateRound(ctx context.Context, accountId int, businessId int) (bool, error) {
	if accountId == 0 {
		return false, errors.New("account id is 0")
	}

	if businessId == 0 {
		return false, errors.New("business id is 0")
	}

	member, err := s.repo.Business().GetBusinessMember(ctx, businessId, accountId)
	if err != nil {
		return false, err
	}

	for _, permission := range member.Role.Permissions {
		switch permission.Value {
		case business.RolePermissionValueBusinessFullAccess:
			return true, nil
		}
	}

	return false, nil
}

func (s *PermissionService) CanViewRoundInvestments(ctx context.Context, accountId int, roundId int) (bool, error) {
	if accountId == 0 {
		return false, errors.New("account id is 0")
	}

	if roundId == 0 {
		return false, errors.New("round id is 0")
	}

	member, err := s.repo.Business().GetBusinessMember(ctx, roundId, accountId)
	if err != nil {
		return false, err
	}

	for _, permission := range member.Role.Permissions {
		switch permission.Value {
		case business.RolePermissionValueBusinessFullAccess:
			return true, nil
		}
	}

	return false, nil
}

func (s *PermissionService) CanDeleteRound(ctx context.Context, accountId int, roundId int) (bool, error) {
	if accountId == 0 {
		return false, errors.New("account id is 0")
	}

	if roundId == 0 {
		return false, errors.New("round id is 0")
	}

	member, err := s.repo.Business().GetBusinessMember(ctx, roundId, accountId)
	if err != nil {
		return false, err
	}

	for _, permission := range member.Role.Permissions {
		switch permission.Value {
		case business.RolePermissionValueBusinessFullAccess:
			return true, nil
		}
	}

	return false, nil
}

func (s *PermissionService) CanViewBusinessMembers(ctx context.Context, accountId int, businessId int) (bool, error) {
	if accountId == 0 {
		return false, errors.New("account id is 0")
	}

	if businessId == 0 {
		return false, errors.New("business id is 0")
	}

	member, err := s.repo.Business().GetBusinessMember(ctx, businessId, accountId)
	if err != nil {
		return false, err
	}

	for _, permission := range member.Role.Permissions {
		switch permission.Value {
		case business.RolePermissionValueBusinessFullAccess:
			return true, nil
		}
	}

	return false, nil
}

func (s *PermissionService) CanViewBusinessMemberRoles(ctx context.Context, accountId int, businessId int) (bool, error) {
	if accountId == 0 {
		return false, errors.New("account id is 0")
	}

	if businessId == 0 {
		return false, errors.New("business id is 0")
	}

	member, err := s.repo.Business().GetBusinessMember(ctx, businessId, accountId)
	if err != nil {
		return false, err
	}

	for _, permission := range member.Role.Permissions {
		switch permission.Value {
		case business.RolePermissionValueBusinessFullAccess:
			return true, nil
		}
	}

	return false, nil
}

func (s *PermissionService) CanBusinessCreateRound(ctx context.Context, businessProp *business.Business) (bool, error) {
	if businessProp == nil {
		return false, errors.New("business is nil")
	}

	// If the business does not have a legal section, we cannot create a round
	if businessProp.BusinessLegalSectionID == nil {
		return false, nil
	}

	if businessProp.Status != business.BusinessStatusActive {
		return false, nil
	}

	return true, nil
}

func (s *PermissionService) CanAccountCreateRound(ctx context.Context, accountId int, businessId int) (bool, error) {
	if accountId == 0 {
		return false, errors.New("account id is 0")
	}

	if businessId == 0 {
		return false, errors.New("business id is 0")
	}

	member, err := s.repo.Business().GetBusinessMember(ctx, businessId, accountId)
	if err != nil {
		return false, err
	}

	for _, permission := range member.Role.Permissions {
		switch permission.Value {
		case business.RolePermissionValueBusinessFullAccess:
			return true, nil
		}
	}

	return false, nil
}
