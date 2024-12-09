package business

import (
	"context"
	"fundlevel/internal/entities/business"

	"github.com/uptrace/bun"
)

func (r *BusinessRepository) CreateBusinessLegalSection(ctx context.Context, businessId int, params business.CreateBusinessLegalSectionParams) error {
	err := r.db.RunInTx(ctx, nil, func(ctx context.Context, tx bun.Tx) error {
		var sectionId int
		err := tx.
			NewInsert().
			Model(&params).
			Returning("id").
			Scan(ctx, &sectionId)
		if err != nil {
			return err
		}

		_, err = tx.
			NewUpdate().
			Model(&business.Business{
				BusinessLegalSectionID: &sectionId,
			}).
			OmitZero().
			Where("id = ?", businessId).
			Exec(ctx)

		return err
	})

	return err
}
