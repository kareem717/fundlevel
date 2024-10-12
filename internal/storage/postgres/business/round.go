package business

import (
	"context"

	"fundlevel/internal/entities/round"
	"fundlevel/internal/storage/postgres/shared"

	"github.com/uptrace/bun"
)

func (r *BusinessRepository) GetRoundsByFilterAndCursor(ctx context.Context, businessId int, filter round.RoundFilter, paginationParams shared.CursorPagination) ([]round.RoundWithSubtypes, error) {
	resp := []round.RoundWithSubtypes{}

	query := r.db.
		NewSelect().
		Model(&resp).
		Relation("FixedTotalRound").
		Relation("DutchDynamicRound").
		Relation("PartialTotalRound").
		Relation("RegularDynamicRound").
		Join("JOIN ventures on round_with_subtypes.venture_id = ventures.id").
		Where("ventures.business_id = ?", businessId).
		Where("round_with_subtypes.id >= ?", paginationParams.Cursor).
		Order("round_with_subtypes.id").
		Limit(paginationParams.Limit)

	if len(filter.Status) > 0 {
		query = query.Where("round_with_subtypes.status IN (?)", bun.In(filter.Status))
	}

	if !filter.MinEndsAt.IsZero() {
		query = query.Where("round_with_subtypes.ends_at >= ?", filter.MinEndsAt)
	}

	if !filter.MaxEndsAt.IsZero() {
		query = query.Where("round_with_subtypes.ends_at <= ?", filter.MaxEndsAt)
	}

	err := query.Scan(ctx)
	return resp, err
}
