package round

import (
	"context"
	"database/sql"
	"fundlevel/internal/entities/investment"
	"fundlevel/internal/entities/round"
	postgres "fundlevel/internal/storage/shared"

	"github.com/uptrace/bun"
)

type RoundRepository struct {
	db  bun.IDB
	ctx context.Context
}

// NewRoundRepository returns a new instance of the repository.
func NewRoundRepository(db bun.IDB, ctx context.Context) *RoundRepository {
	return &RoundRepository{
		db:  db,
		ctx: ctx,
	}
}

func (r *RoundRepository) GetById(ctx context.Context, id int) (round.Round, error) {
	resp := round.Round{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Where("id = ?", id).
		Scan(ctx)

	return resp, err
}

func (r *RoundRepository) GetByCursor(
	ctx context.Context,
	paginationParams postgres.CursorPagination,
) ([]round.Round, error) {
	resp := []round.Round{}

	query := r.db.
		NewSelect().
		Model(&resp).
		Limit(paginationParams.Limit)

	// query = helper.ApplyRoundFilter(query, filter)

	cursorCondition := "round.id >= ?"
	if paginationParams.Cursor > 0 {
		cursorCondition = "round.id <= ?"
	}

	err := query.
		Where(cursorCondition, paginationParams.Cursor).
		Scan(ctx, &resp)

	return resp, err
}

func (r *RoundRepository) GetByPage(
	ctx context.Context,
	paginationParams postgres.OffsetPagination,
) ([]round.Round, int, error) {
	resp := []round.Round{}
	offset := (paginationParams.Page - 1) * paginationParams.PageSize

	query := r.db.
		NewSelect().
		Model(&resp).
		Relation("Business").
		Offset(offset).
		Limit(paginationParams.PageSize + 1)

	count, err := query.ScanAndCount(ctx, &resp)

	return resp, count, err
}

func (r *RoundRepository) Delete(ctx context.Context, id int) error {
	res, err :=
		r.db.
			NewDelete().
			Model(&round.Round{}).
			Where("id = ?", id).
			Exec(ctx)

	if rows, _ := res.RowsAffected(); rows == 0 {
		return sql.ErrNoRows
	}

	return err
}

func (r *RoundRepository) Create(ctx context.Context, params round.CreateRoundParams) (round.Round, error) {
	resp := round.Round{}

	err := r.db.RunInTx(ctx, nil, func(ctx context.Context, tx bun.Tx) error {
		terms := round.RoundTerm{}

		err := tx.NewInsert().
			Model(&params.Terms).
			Returning("*").
			Scan(ctx, &terms)

		if err != nil {
			return err
		}

		err = tx.NewInsert().
			Model(&params.Round).
			Value("terms_id", "?", terms.ID).
			Returning("*").
			Scan(ctx, &resp)

		if err != nil {
			return err
		}

		return nil
	})

	return resp, err
}

func (r *RoundRepository) Update(ctx context.Context, id int, params round.UpdateRoundParams) (round.Round, error) {
	resp := round.Round{}

	err := r.db.NewUpdate().
		Model(&params).
		ModelTableExpr("rounds").
		Where("rounds.id = ?", id).
		Returning("*").
		Scan(ctx, &resp)

	return resp, err
}

func (r *RoundRepository) GetAvailableShares(ctx context.Context, id int) (int, error) {
	var totalSharesForSale int

	err := r.db.NewSelect().
		Model((*round.Round)(nil)).
		Column("total_shares_for_sale").
		Where("id = ?", id).
		Scan(ctx, &totalSharesForSale)

	if err != nil {
		return 0, err
	}

	var sharesPurchased int
	err = r.db.NewSelect().
		TableExpr("(?) AS locked_investments",
			r.db.NewSelect().
				Model((*investment.Investment)(nil)).
				Column("share_quantity").
				Where("round_id = ?", id).
				Where("status IN (?)",
					bun.In([]investment.InvestmentStatus{
						investment.InvestmentStatusPaymentCompleted,
						investment.InvestmentStatusCompleted,
					})).
				// lock the rows for update, avoid race condition
				For("UPDATE")).
		ColumnExpr("SUM(locked_investments.share_quantity)").
		Scan(ctx, &sharesPurchased)

	if err != nil {
		return 0, err
	}

	return totalSharesForSale - sharesPurchased, nil
}
