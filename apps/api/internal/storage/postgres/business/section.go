package business

import (
	"context"
	"fundlevel/internal/entities/business"

	"github.com/uptrace/bun"
)

func (r *BusinessRepository) UpsertBusinessLegalSection(ctx context.Context, businessId int, params business.UpsertBusinessLegalSectionParams) error {
	return r.db.RunInTx(ctx, nil, func(ctx context.Context, tx bun.Tx) error {
		var currSectionId *int
		if err := tx.NewSelect().
			Model(&business.Business{}).
			Column("business_legal_section_id").
			Where("id = ?", businessId).
			Scan(ctx, &currSectionId); err != nil {
			return err
		}

		if currSectionId != nil {
			_, err := tx.NewUpdate().
				Model(&params).
				Where("id = ?", *currSectionId).
				Exec(ctx)
			return err
		}

		// Insert new section and update business
		var sectionId int
		err := tx.NewInsert().
			Model(&params).
			Returning("id").
			Scan(ctx, &sectionId)
		if err != nil {
			return err
		}

		_, err = tx.NewUpdate().
			Model(&business.Business{BusinessLegalSectionID: &sectionId}).
			OmitZero().
			Where("id = ?", businessId).
			Exec(ctx)

		return err
	})
}
