package account

import (
	"context"

	"fundlevel/internal/entities/account"
)

func (s *AccountRepository) CreateStripeIdentity(ctx context.Context, accountID int, params account.CreateStripeIdentityParams) (account.StripeIdentity, error) {
	resp := account.StripeIdentity{}

	err := s.db.NewInsert().
		Model(&params).
		Value("account_id", "?", accountID).
		Returning("*").
		Scan(ctx, &resp)

	return resp, err
}

func (s *AccountRepository) GetStripeIdentity(ctx context.Context, accountID int) (account.StripeIdentity, error) {
	resp := account.StripeIdentity{}

	err := s.db.NewSelect().
		Model(&resp).
		Where("account_id = ?", accountID).
		Scan(ctx)

	return resp, err
}

func (s *AccountRepository) DeleteStripeIdentity(ctx context.Context, accountID int) error {
	_, err := s.db.NewDelete().
		Model((*account.StripeIdentity)(nil)).
		Where("account_id = ?", accountID).
		Exec(ctx)

	return err
}
