package investment

import (
	"context"

	"fundlevel/internal/entities/investment"
	"fundlevel/internal/entities/round"
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

func (r *InvestmentRepository) Create(ctx context.Context, investorId int, params investment.CreateInvestmentParams) (investment.Investment, error) {
	resp := investment.Investment{}

	err := r.db.RunInTx(ctx, nil, func(ctx context.Context, tx bun.Tx) error {
		acceptance := round.RoundTermsAcceptance{}

		err := tx.NewInsert().
			Model(&params.TermsAcceptance).
			Returning("*").
			Scan(ctx, &acceptance)

		if err != nil {
			return err
		}

		err = tx.NewInsert().
			Model(&params.Investment).
			Value("investor_id", "?", investorId).
			Value("terms_acceptance_id", "?", acceptance.ID).
			Returning("*").
			Scan(ctx, &resp)

		if err != nil {
			return err
		}

		return nil
	})

	return resp, err
}

func (r *InvestmentRepository) Delete(ctx context.Context, id int) error {
	_, err := r.db.NewDelete().
		Model(&investment.Investment{}).
		Where("investment.id = ?", id).
		Exec(ctx)

	return err
}

func (r *InvestmentRepository) GetById(ctx context.Context, id int) (investment.Investment, error) {
	resp := investment.Investment{}

	err := r.db.NewSelect().
		Model(&resp).
		// Relation("Round").
		// Relation("Investor").
		Relation("Payments").
		Where("investment.id = ?", id).
		Scan(ctx)

	return resp, err
}

func (r *InvestmentRepository) GetByCursor(ctx context.Context, paginationParams postgres.CursorPagination) ([]investment.Investment, error) {
	resp := []investment.Investment{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Limit(paginationParams.Limit).
		Where("investment.id >= ?", paginationParams.Cursor).
		Scan(ctx, &resp)

	return resp, err
}

func (r *InvestmentRepository) GetByPage(ctx context.Context, paginationParams postgres.OffsetPagination) ([]investment.Investment, int, error) {
	resp := []investment.Investment{}
	offset := (paginationParams.Page - 1) * paginationParams.PageSize

	count, err := r.db.
		NewSelect().
		Model(&resp).
		// Relation("Round").
		// Relation("Investor").
		Offset(offset).
		Limit(paginationParams.PageSize+1).
		ScanAndCount(ctx, &resp)

	return resp, count, err
}

func (r *InvestmentRepository) GetByRoundIdAndAccountId(ctx context.Context, roundId int, accountId int) (investment.Investment, error) {
	resp := investment.Investment{}

	err := r.db.NewSelect().
		Model(&resp).
		// Relation("Round").
		// Relation("Investor").
		Where("investment.round_id = ?", roundId).
		Where("investment.investor_id = ?", accountId).
		Scan(ctx)

	return resp, err
}
