package investment

import (
	"context"

	"fundlevel/internal/entities/investment"
	"fundlevel/internal/storage/postgres/shared"

	"github.com/uptrace/bun"
)

type InvestmentRepository struct {
	db  bun.IDB
	ctx context.Context
}

// NewRoundRepository returns a new instance of the repository.
func NewInvestmentRepository(db bun.IDB, ctx context.Context) *InvestmentRepository {
	return &InvestmentRepository{
		db:  db,
		ctx: ctx,
	}
}

func (r *InvestmentRepository) Create(ctx context.Context, params investment.CreateInvestmentParams) (investment.RoundInvestment, error) {
	resp := investment.RoundInvestment{}

	err := r.db.NewInsert().
		Model(&params).
		ModelTableExpr("round_investments").
		Returning("*").
		Scan(ctx, &resp)

	return resp, err
}

func (r *InvestmentRepository) Delete(ctx context.Context, id int) error {
	_, err := r.db.NewDelete().
		Model(&investment.RoundInvestment{}).
		Where("round_investment.id = ?", id).
		Exec(ctx)

	return err
}

func (r *InvestmentRepository) GetById(ctx context.Context, id int) (investment.RoundInvestment, error) {
	resp := investment.RoundInvestment{}

	err := r.db.NewSelect().
		Model(&resp).
		Relation("Round").
		Relation("Investor").
		Where("round_investment.id = ?", id).
		Scan(ctx)

	return resp, err
}

func (r *InvestmentRepository) GetByCursor(ctx context.Context, paginationParams shared.CursorPagination) ([]investment.RoundInvestment, error) {
	resp := []investment.RoundInvestment{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Relation("Round").
		Relation("Investor").
		Where("round_investment.id >= ?", paginationParams.Cursor).
		Order("round_investment.id").
		Limit(paginationParams.Limit).
		Scan(ctx)

	return resp, err
}

func (r *InvestmentRepository) GetByPage(ctx context.Context, paginationParams shared.OffsetPagination) ([]investment.RoundInvestment, error) {
	resp := []investment.RoundInvestment{}
	offset := (paginationParams.Page - 1) * paginationParams.PageSize

	err := r.db.
		NewSelect().
		Model(&resp).
		Relation("Round").
		Relation("Investor").
		Order("round_investment.id").
		Offset(offset).
		Limit(paginationParams.PageSize + 1).
		Scan(ctx)

	return resp, err
}

func (r *InvestmentRepository) Update(ctx context.Context, id int, params investment.UpdateInvestmentParams) (investment.RoundInvestment, error) {
	resp := investment.RoundInvestment{}

	err := r.db.NewUpdate().
		Model(&params).
		ModelTableExpr("round_investments").
		Where("round_investments.id = ?", id).
		Returning("*").
		Scan(ctx, &resp)

	return resp, err
}
