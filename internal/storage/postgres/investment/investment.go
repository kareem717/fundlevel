package investment

import (
	"context"

	"fundlevel/internal/entities/investment"
	"fundlevel/internal/storage/postgres/helper"
	postgres "fundlevel/internal/storage/shared"

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
		Relation("Payment").
		Where("round_investment.id = ?", id).
		Scan(ctx)

	return resp, err
}

func (r *InvestmentRepository) GetByCursor(ctx context.Context, paginationParams postgres.CursorPagination, filter investment.InvestmentFilter) ([]investment.RoundInvestment, error) {
	resp := []investment.RoundInvestment{}

	query := r.db.
		NewSelect().
		Model(&resp).
		Relation("Round").
		Relation("Investor").
		Limit(paginationParams.Limit)

	query = helper.ApplyInvestmentFilter(query, filter)

	cursorCondition := "round_investment.id >= ?"
	if filter.SortOrder != "asc" && paginationParams.Cursor > 0 {
		cursorCondition = "round_investment.id <= ?"
	}

	err := query.Where(cursorCondition, paginationParams.Cursor).Scan(ctx, &resp)

	return resp, err
}

func (r *InvestmentRepository) GetByPage(ctx context.Context, paginationParams postgres.OffsetPagination, filter investment.InvestmentFilter) ([]investment.RoundInvestment, int, error) {
	resp := []investment.RoundInvestment{}
	offset := (paginationParams.Page - 1) * paginationParams.PageSize

	query := r.db.
		NewSelect().
		Model(&resp).
		Relation("Round").
		Relation("Investor").
		Offset(offset).
		Limit(paginationParams.PageSize + 1)

	count, err := helper.ApplyInvestmentFilter(query, filter).ScanAndCount(ctx, &resp)

	return resp, count, err
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

func (r *InvestmentRepository) GetByRoundIdAndAccountId(ctx context.Context, roundId int, accountId int) (investment.RoundInvestment, error) {
	resp := investment.RoundInvestment{}

	err := r.db.NewSelect().
		Model(&resp).
		Relation("Round").
		Relation("Investor").
		Where("round_investment.round_id = ?", roundId).
		Where("round_investment.investor_id = ?", accountId).
		Scan(ctx)

	return resp, err
}

func (r *InvestmentRepository) UpdateProcessingAndPendingInvestmentsByRoundId(ctx context.Context, roundId int, status investment.InvestmentStatus) error {
	_, err := r.db.NewUpdate().
		Model(&investment.RoundInvestment{}).
		Where("round_investment.round_id = ?", roundId).
		Where("round_investment.status IN (?)", bun.In([]investment.InvestmentStatus{investment.InvestmentStatusProcessing, investment.InvestmentStatusPending})).
		Set("status = ?", status).
		Exec(ctx)

	return err
}
