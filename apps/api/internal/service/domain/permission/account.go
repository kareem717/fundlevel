package permission

import (
	"context"
	"fundlevel/internal/entities/account"
)

func (s *PermissionService) CanCreateBusiness(ctx context.Context, account account.Account) (bool, error) {
	return true, nil
}

func (s *PermissionService) CanInvestInRound(ctx context.Context, identity account.StripeIdentity) (bool, error) {

	return true, nil
}
