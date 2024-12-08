package business

import (
	"context"
	"errors"
	"fundlevel/internal/entities/business"

	"github.com/uptrace/bun"
)

type BusinessRepository struct {
	db  bun.IDB
	ctx context.Context
}

func NewBusinessRepository(db bun.IDB, ctx context.Context) *BusinessRepository {
	return &BusinessRepository{db: db, ctx: ctx}
}

// TODO: this logic should be in a service, not in the repository
func (r *BusinessRepository) Create(ctx context.Context, params business.CreateBusinessParams) error {
	err := r.db.RunInTx(ctx, nil, func(ctx context.Context, tx bun.Tx) error {
		var businessRecord business.Business
		err := tx.NewInsert().
			Model(&params.Business).
			ModelTableExpr("businesses").
			Returning("*").
			Scan(ctx, &businessRecord)
		if err != nil {
			return err
		}

		businessOwnerRole := business.BusinessMemberRole{
			Name: "Owner",
		}

		err = tx.NewInsert().
			Model(&businessOwnerRole).
			Column("name").
			Returning("*").
			Scan(ctx, &businessOwnerRole)
		if err != nil {
			return err
		}

		businessOwnerRolePermission := business.RolePermission{
			RoleId: businessOwnerRole.ID,
			Value:  business.RolePermissionValueBusinessFullAccess,
		}

		err = tx.NewInsert().
			Model(&businessOwnerRolePermission).
			Returning("*").
			Scan(ctx, &businessOwnerRolePermission)
		if err != nil {
			return err
		}

		businessMember := business.BusinessMember{
			BusinessId: businessRecord.ID,
			AccountId:  params.InitialOwnerID,
			RoleId:     businessOwnerRole.ID,
		}

		err = tx.NewInsert().
			Model(&businessMember).
			Column("business_id").
			Column("account_id").
			Column("role_id").
			ModelTableExpr("business_members").
			Returning("*").
			Scan(ctx, &businessMember)
		if err != nil {
			return err
		}

		params.StripeAccount.BusinessID = businessRecord.ID
		_, err = tx.NewInsert().
			Model(&params.StripeAccount).
			ModelTableExpr("business_stripe_accounts").
			Exec(ctx)
		if err != nil {
			return err
		}

		industryIds := make([]business.BusinessIndustries, len(params.IndustryIDs))
		for i, industryId := range params.IndustryIDs {
			industryIds[i].BusinessID = businessRecord.ID
			industryIds[i].IndustryID = industryId
		}

		_, err = tx.NewInsert().
			Model(&industryIds).
			ModelTableExpr("business_industries").
			Exec(ctx)
		if err != nil {
			return err
		}

		return nil
	})

	return err
}

func (r *BusinessRepository) GetById(ctx context.Context, id int) (business.Business, error) {
	resp := business.Business{}

	err := r.db.NewSelect().
		Model(&resp).
		Relation("Address").
		Relation("StripeAccount").
		Relation("Industries").
		Where("business.id = ?", id).
		Scan(ctx)

	return resp, err
}

func (r *BusinessRepository) Delete(ctx context.Context, id int) error {
	resp, err := r.db.NewDelete().
		Model(&business.Business{}).
		Where("id = ?", id).
		Exec(ctx)
	if err != nil {
		return err
	}

	rowsAffected, err := resp.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return errors.New("business not found")
	}

	return err
}

func (r *BusinessRepository) GetByStripeConnectedAccountId(ctx context.Context, stripeConnectedAccountId string) (business.Business, error) {
	resp := business.Business{}

	err := r.db.NewSelect().
		Model(&resp).
		Where("stripe_connected_account_id = ?", stripeConnectedAccountId).
		Scan(ctx)

	return resp, err
}

func (r *BusinessRepository) Update(ctx context.Context, id int, params business.UpdateBusinessParams) (business.Business, error) {
	resp := business.Business{}

	err :=
		r.db.
			NewUpdate().
			Model(&params).
			ModelTableExpr("businesses").
			Where("id = ?", id).
			Returning("*").
			OmitZero().
			Scan(ctx, &resp)

	return resp, err
}
