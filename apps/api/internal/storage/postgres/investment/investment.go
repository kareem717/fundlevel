package investment

import (
	"context"

	"fundlevel/internal/entities/investment"
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

func (r *InvestmentRepository) Create(ctx context.Context, investorId int, usdCentValue int64, params investment.CreateInvestmentParams) (investment.Investment, error) {
	resp := investment.Investment{}

	err := r.db.NewInsert().
		Model(&params).
		Value("investor_id", "?", investorId).
		Value("total_usd_cent_value", "?", usdCentValue).
		Value("status", "?", investment.InvestmentStatusAwaitingConfirmation).
		Returning("*").
		Scan(ctx, &resp)

	return resp, err
}

func (r *InvestmentRepository) Delete(ctx context.Context, id int) error {
	_, err := r.db.NewDelete().
		Model(&investment.Investment{}).
		Where("id = ?", id).
		Exec(ctx)

	return err
}

func (r *InvestmentRepository) GetById(ctx context.Context, id int) (investment.Investment, error) {
	resp := investment.Investment{}

	err := r.db.NewSelect().
		Model(&resp).
		Where("id = ?", id).
		Scan(ctx)

	return resp, err
}

func (r *InvestmentRepository) GetByCursor(ctx context.Context, paginationParams postgres.CursorPagination) ([]investment.Investment, error) {
	resp := []investment.Investment{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Limit(paginationParams.Limit).
		Where("id >= ?", paginationParams.Cursor).
		Scan(ctx, &resp)

	return resp, err
}

func (r *InvestmentRepository) GetByPage(ctx context.Context, paginationParams postgres.OffsetPagination) ([]investment.Investment, int, error) {
	resp := []investment.Investment{}
	offset := (paginationParams.Page - 1) * paginationParams.PageSize

	count, err := r.db.
		NewSelect().
		Model(&resp).
		Offset(offset).
		Limit(paginationParams.PageSize+1).
		ScanAndCount(ctx, &resp)

	return resp, count, err
}

func (r *InvestmentRepository) GetByRoundIdAndAccountId(ctx context.Context, roundId int, accountId int) (investment.Investment, error) {
	resp := investment.Investment{}

	err := r.db.NewSelect().
		Model(&resp).
		Where("round_id = ?", roundId).
		Where("investor_id = ?", accountId).
		Scan(ctx)

	return resp, err
}

func (r *InvestmentRepository) Update(ctx context.Context, id int, params investment.UpdateInvestmentParams) (investment.Investment, error) {
	resp := investment.Investment{}

	err := r.db.NewUpdate().
		Model(&params).
		Where("id = ?", id).
		OmitZero().
		Returning("*").
		Scan(ctx, &resp)

	return resp, err
}

func (r *InvestmentRepository) CloseIncompleteInvestments(ctx context.Context, roundId int) error {
	_, err := r.db.NewUpdate().
		Model(&investment.Investment{}).
		Set("status = ?", investment.InvestmentStatusRoundClosed).
		Where("round_id = ?", roundId).
		Where("status NOT IN (?)",
			bun.In([]investment.InvestmentStatus{
				investment.InvestmentStatusCompleted,
				investment.InvestmentStatusPaymentCompleted,
			})).
		Exec(ctx)

	return err
}

func (r *InvestmentRepository) AggregateByInvestorId(ctx context.Context, investorId int) ([]investment.Aggregate, error) {
	resp := make([]investment.Aggregate, 12)

	monthsCTE := r.db.
		NewSelect().
		ColumnExpr(
			`generate_series(
				date_trunc('month', CURRENT_DATE - INTERVAL '11 months'),
				date_trunc('month', CURRENT_DATE),
				'1 month'
			)::date AS month`,
		)

	err := r.db.NewSelect().
		With("months", monthsCTE).
		TableExpr("months m").
		ColumnExpr("m.month AS date").
		ColumnExpr("COALESCE(SUM(i.total_usd_cent_value), 0) AS value_usd_cents").
		Join("LEFT JOIN investments i").
		JoinOn("date_trunc('month', i.created_at) = m.month").
		JoinOn("i.investor_id = ?", investorId).
		JoinOn("i.status IN (?)",
			bun.In([]investment.InvestmentStatus{
				investment.InvestmentStatusPaymentCompleted,
				investment.InvestmentStatusCompleted,
			})).
		GroupExpr("m.month").
		OrderExpr("m.month ASC").
		Limit(12).
		Scan(ctx, &resp)

	return resp, err
}
