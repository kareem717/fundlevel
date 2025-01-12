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
func (r *BusinessRepository) Create(ctx context.Context, params business.CreateBusinessParams, initialOwnerId int) (business.Business, error) {
	var businessRecord business.Business
	err := r.db.RunInTx(ctx, nil, func(ctx context.Context, tx bun.Tx) error {
		err := tx.NewInsert().
			Model(&params.Business).
			ModelTableExpr("businesses").
			Returning("*").
			Scan(ctx, &businessRecord)
		if err != nil {
			return err
		}

		businessMember := business.BusinessMember{
			BusinessId: businessRecord.ID,
			AccountId:  initialOwnerId,
		}

		_, err = tx.NewInsert().
			Model(&businessMember).
			Column("business_id").
			Column("account_id").
			Column("role_id").
			Value("role_id", "(?)",
				tx.NewSelect().
					Model(&business.BusinessMemberRole{}).
					Where("name = ?", business.BusinessMemberRoleNameOwner).
					ColumnExpr("id"),
			).
			ModelTableExpr("business_members").
			Exec(ctx)

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

	return businessRecord, err
}

func (r *BusinessRepository) GetById(ctx context.Context, id int) (business.Business, error) {
	resp := business.Business{}

	err := r.db.NewSelect().
		Model(&resp).
		Relation("StripeAccount").
		Relation("Industries").
		Relation("Legal").
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
