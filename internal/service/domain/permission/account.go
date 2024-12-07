package permission

import (
	"context"
	"fundlevel/internal/entities/account"
)

func (s *PermissionService) CanCreateBusiness(ctx context.Context, account account.Account) (bool, error) {
	return true, nil
}
