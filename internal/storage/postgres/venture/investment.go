package venture

import (
	"context"

	"fundlevel/internal/entities/investment"
	"fundlevel/internal/storage/postgres/shared"
)

func (r *VentureRepository) GetVentureRoundInvestmentsByCursor(ctx context.Context, ventureId int, paginationParams shared.CursorPagination) ([]investment.RoundInvestment, error) {
	resp := []investment.RoundInvestment{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Relation("Investor").
		Relation("Round").
		Where("round.venture_id = ?", ventureId).
		Where("round_investment.id >= ?", paginationParams.Cursor).
		Order("round_investment.id").
		Limit(paginationParams.Limit).
		Scan(ctx)

	return resp, err
}

func (r *VentureRepository) GetVentureRoundInvestmentsByPage(ctx context.Context, ventureId int, paginationParams shared.OffsetPagination) ([]investment.RoundInvestment, error) {
	resp := []investment.RoundInvestment{}
	offset := (paginationParams.Page - 1) * paginationParams.PageSize

	err := r.db.
		NewSelect().
		Model(&resp).
		Relation("Investor").
		Relation("Round").
		Where("round.venture_id = ?", ventureId).
		Order("round_investment.id").
		Offset(offset).
		Limit(paginationParams.PageSize + 1).
		Scan(ctx)

	return resp, err
}
