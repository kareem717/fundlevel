package offer

import (
	"context"
	"database/sql"

	"fundlevel/internal/entities/offer"
	"fundlevel/internal/storage/postgres/shared"

	"github.com/uptrace/bun"
)

type OfferRepository struct {
	db  bun.IDB
	ctx context.Context
}

// NewOfferRepository returns a new instance of the repository.
func NewOfferRepository(db bun.IDB, ctx context.Context) *OfferRepository {
	return &OfferRepository{
		db:  db,
		ctx: ctx,
	}
}

func (r *OfferRepository) Create(ctx context.Context, params offer.CreateOfferParams) (offer.Offer, error) {
	resp := offer.Offer{}

	err := r.db.
		NewInsert().
		Model(&params).
		ModelTableExpr("offers").
		Returning("*").
		Scan(ctx, &resp)

	return resp, err
}

func (r *OfferRepository) Update(ctx context.Context, id int, params offer.UpdateOfferParams) (offer.Offer, error) {
	resp := offer.Offer{}

	err :=
		r.db.
			NewUpdate().
			Model(&params).
			ModelTableExpr("offers").
			Where("id = ?", id).
			Returning("*").
			OmitZero().
			Scan(ctx, &resp)

	return resp, err
}

func (r *OfferRepository) Delete(ctx context.Context, id int) error {
	res, err :=
		r.db.
			NewDelete().
			Model(&offer.Offer{}).
			Where("id = ?", id).
			Exec(ctx)

	if rows, _ := res.RowsAffected(); rows == 0 {
		return sql.ErrNoRows
	}

	return err
}

func (r *OfferRepository) GetById(ctx context.Context, id int) (offer.Offer, error) {
	resp := offer.Offer{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Where("id = ?", id).
		Scan(ctx)

	return resp, err
}

func (r *OfferRepository) GetByRoundId(ctx context.Context, roundId int, paginationParams shared.PaginationRequest) ([]offer.Offer, error) {
	resp := []offer.Offer{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Where("round_id = ?", roundId).
		Where("id >= ?", paginationParams.Cursor).
		Order("id").
		Limit(paginationParams.Limit).
		Scan(ctx)

	return resp, err
}

func (r *OfferRepository) GetAll(ctx context.Context, paginationParams shared.PaginationRequest) ([]offer.Offer, error) {
	resp := []offer.Offer{}

	err := r.db.
		NewSelect().
		Model(&resp).
		Where("id >= ?", paginationParams.Cursor).
		Order("id").
		Limit(paginationParams.Limit).
		Scan(ctx)

	return resp, err
}
