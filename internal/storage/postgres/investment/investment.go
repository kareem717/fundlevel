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

func (r *InvestmentRepository) CreateIntent(ctx context.Context, params investment.CreateInvestmentIntentParams) (investment.InvestmentIntent, error) {
	resp := investment.InvestmentIntent{}

	err := r.db.NewInsert().
		Model(&params).
		ModelTableExpr("investments").
		Returning("*").
		Scan(ctx, &resp)

	return resp, err
}

func (r *InvestmentRepository) DeleteIntent(ctx context.Context, id int) error {
	_, err := r.db.NewDelete().
		Model(&investment.InvestmentIntent{}).
		Where("investment.id = ?", id).
		Exec(ctx)

	return err
}

func (r *InvestmentRepository) GetIntentById(ctx context.Context, id int) (investment.InvestmentIntent, error) {
	resp := investment.InvestmentIntent{}

	err := r.db.NewSelect().
		Model(&resp).
		Relation("Round").
		Relation("Investor").
		Relation("Payment").
		Where("investment.id = ?", id).
		Scan(ctx)

	return resp, err
}

func (r *InvestmentRepository) GetIntentByCursor(ctx context.Context, paginationParams postgres.CursorPagination, filter investment.InvestmentIntentFilter) ([]investment.InvestmentIntent, error) {
	resp := []investment.InvestmentIntent{}

	query := r.db.
		NewSelect().
		Model(&resp).
		Relation("Round").
		Relation("Investor").
		Limit(paginationParams.Limit)

	query = helper.ApplyInvestmentFilter(query, filter)

	cursorCondition := "investment.id >= ?"
	if filter.SortOrder != "asc" && paginationParams.Cursor > 0 {
		cursorCondition = "investment.id <= ?"
	}

	err := query.Where(cursorCondition, paginationParams.Cursor).Scan(ctx, &resp)

	return resp, err
}

func (r *InvestmentRepository) GetIntentByPage(ctx context.Context, paginationParams postgres.OffsetPagination, filter investment.InvestmentIntentFilter) ([]investment.InvestmentIntent, int, error) {
	resp := []investment.InvestmentIntent{}
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

func (r *InvestmentRepository) UpdateIntent(ctx context.Context, id int, params investment.UpdateInvestmentIntentParams) (investment.InvestmentIntent, error) {
	resp := investment.InvestmentIntent{}

	err := r.db.NewUpdate().
		Model(&params).
		ModelTableExpr("investments").
		Where("investments.id = ?", id).
		Returning("*").
		Scan(ctx, &resp)

	return resp, err
}

func (r *InvestmentRepository) GetIntentByRoundIdAndAccountId(ctx context.Context, roundId int, accountId int) (investment.InvestmentIntent, error) {
	resp := investment.InvestmentIntent{}

	err := r.db.NewSelect().
		Model(&resp).
		Relation("Round").
		Relation("Investor").
		Where("investment.round_id = ?", roundId).
		Where("investment.investor_id = ?", accountId).
		Scan(ctx)

	return resp, err
}

func (r *InvestmentRepository) UpdateProcessingAndPendingInvestmentIntentsByRoundId(ctx context.Context, roundId int, status investment.InvestmentIntentStatus) error {
	_, err := r.db.NewUpdate().
		Model(&investment.InvestmentIntent{}).
		Where("investment.round_id = ?", roundId).
		//TODO: This is logic doesn't work anymore
		Where("investment.status IN (?)", bun.In([]investment.InvestmentIntentStatus{investment.InvestmentIntentStatusTerms, investment.InvestmentIntentStatusPayment})).
		Set("status = ?", status).
		Exec(ctx)

	return err
}
