package impression

import (
	"context"
	"fundlevel/internal/entities/analytic"

	"github.com/uptrace/bun"
)

type ImpressionRepository struct {
	db  bun.IDB
	ctx context.Context
}

func NewImpressionRepository(db bun.IDB, ctx context.Context) *ImpressionRepository {
	return &ImpressionRepository{
		db:  db,
		ctx: ctx,
	}
}

func (r *ImpressionRepository) CreateRoundImpression(ctx context.Context, params analytic.CreateRoundImpressionParams) error {
	_, err := r.db.
		NewInsert().
		Model(&params).
		ModelTableExpr("round_impressions").
		Exec(ctx)

	return err
}

func (r *ImpressionRepository) GetRoundImpressionCount(ctx context.Context, roundId int) (int, error) {
	return r.db.
		NewSelect().
		Model(&analytic.RoundImpression{}).
		ModelTableExpr("round_impressions").
		Where("round_id = ?", roundId).
		Count(ctx)
}
func (r *ImpressionRepository) CreateBusinessImpression(ctx context.Context, params analytic.CreateBusinessImpressionParams) error {
	_, err := r.db.
		NewInsert().
		Model(&params).
		ModelTableExpr("business_impressions").
		Exec(ctx)

	return err
}

func (r *ImpressionRepository) GetBusinessImpressionCount(ctx context.Context, businessId int) (int, error) {
	return r.db.
		NewSelect().
		Model(&analytic.BusinessImpression{}).
		ModelTableExpr("business_impressions").
		Where("business_id = ?", businessId).
		Count(ctx)
}

func (r *ImpressionRepository) CreateVentureImpression(ctx context.Context, params analytic.CreateVentureImpressionParams) error {
	_, err := r.db.
		NewInsert().
		Model(&params).
		ModelTableExpr("venture_impressions").
		Exec(ctx)

	return err
}

func (r *ImpressionRepository) GetVentureImpressionCount(ctx context.Context, ventureId int) (int, error) {
	return r.db.
		NewSelect().
		Model(&analytic.VentureImpression{}).
		ModelTableExpr("venture_impressions").
		Where("venture_id = ?", ventureId).
		Count(ctx)
}
