package round

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"fundlevel/internal/entities/round"
	"fundlevel/internal/server/handler/shared"
	"fundlevel/internal/service"

	"github.com/danielgtaylor/huma/v2"
	"go.uber.org/zap"
)

type httpHandler struct {
	service *service.Service
	logger  *zap.Logger
}

func newHTTPHandler(service *service.Service, logger *zap.Logger) *httpHandler {
	if service == nil {
		panic("service is nil")
	}

	if logger == nil {
		panic("logger is nil")
	}

	return &httpHandler{
		service: service,
		logger:  logger,
	}
}

type CreateRoundInput struct {
	Body round.CreateRoundParams `json:"round"`
}

func (i *CreateRoundInput) Resolve(ctx huma.Context) []error {

	if i.Body.BeginsAt.Before(time.Now().AddDate(0, 0, 1)) {
		return []error{&huma.ErrorDetail{
			Message:  "begins at must be in the future",
			Location: "round.beginsAt",
			Value:    i.Body.BeginsAt,
		}}
	}

	if i.Body.EndsAt.Before(i.Body.BeginsAt) {
		return []error{&huma.ErrorDetail{
			Message:  "ends at must be after begins at",
			Location: "round.endsAt",
			Value:    i.Body.EndsAt,
		}}
	}

	return nil
}

func (h *httpHandler) create(ctx context.Context, input *CreateRoundInput) (*shared.SingleRoundResponse, error) {
	venture, err := h.service.VentureService.GetById(ctx, input.Body.VentureID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, huma.Error404NotFound("Venture ID not found")
		}

		h.logger.Error("failed to fetch venture", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while fetching the venture")
	}

	if account := shared.GetAuthenticatedAccount(ctx); account.ID != venture.Business.OwnerAccountID {
		h.logger.Error("business owner account id does not match authenticated account id",
			zap.Any("business owner account id", venture.Business.OwnerAccountID),
			zap.Any("authenticated account id", account.ID))

		return nil, huma.Error403Forbidden("Cannot create round for a business you do not own")
	}

	round, err := h.service.RoundService.Create(ctx, input.Body)
	if err != nil {
		h.logger.Error("failed to create round", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while creating the round")
	}

	resp := &shared.SingleRoundResponse{}
	resp.Body.Message = "Round created successfully"
	resp.Body.Round = &round

	return resp, nil
}

func (h *httpHandler) delete(ctx context.Context, input *shared.PathIDParam) (*shared.MessageResponse, error) {
	round, err := h.service.RoundService.GetById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("round not found")
		default:
			h.logger.Error("failed to fetch round", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the round")
		}
	}

	if account := shared.GetAuthenticatedAccount(ctx); account.ID != round.Venture.Business.OwnerAccountID {
		h.logger.Error("business owner account id does not match authenticated account id",
			zap.Any("business owner account id", round.Venture.Business.OwnerAccountID),
			zap.Any("authenticated account id", account.ID))

		return nil, huma.Error403Forbidden("Cannot delete round for a business you do not own")
	}

	err = h.service.RoundService.Delete(ctx, input.ID)
	if err != nil {
		h.logger.Error("failed to delete round", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while deleting the round")
	}

	resp := &shared.MessageResponse{}
	resp.Message = "Round deleted successfully"

	return resp, nil
}

func (h *httpHandler) getInvestmentsByCursor(ctx context.Context, input *shared.GetInvestmentsByParentAndCursorInput) (*shared.GetCursorPaginatedRoundInvestmentsOutput, error) {
	round, err := h.service.RoundService.GetById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("round not found")
		default:
			h.logger.Error("failed to fetch round", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the round")
		}
	}

	if account := shared.GetAuthenticatedAccount(ctx); account.ID != round.Venture.Business.OwnerAccountID {
		h.logger.Error("business owner account id does not match authenticated account id",
			zap.Any("business owner account id", round.Venture.Business.OwnerAccountID),
			zap.Any("authenticated account id", account.ID))

		return nil, huma.Error403Forbidden("Cannot get investments for a round for a business you do not own")
	}

	limit := input.Limit + 1

	investments, err := h.service.RoundService.GetInvestmentsByCursor(ctx, input.ID, limit, input.Cursor, input.InvestmentFilter)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("investments not found")
		default:
			h.logger.Error("failed to fetch investments", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the investments")
		}
	}

	resp := &shared.GetCursorPaginatedRoundInvestmentsOutput{}
	resp.Body.Message = "Investments fetched successfully"
	resp.Body.Investments = investments

	if len(investments) == limit {
		resp.Body.NextCursor = &investments[len(investments)-1].ID
		resp.Body.HasMore = true
		resp.Body.Investments = resp.Body.Investments[:len(resp.Body.Investments)-1]
	}

	return resp, nil
}

func (h *httpHandler) getInvestmentsByPage(ctx context.Context, input *shared.GetInvestmentsByParentAndPageInput) (*shared.GetOffsetPaginatedRoundInvestmentsOutput, error) {
	round, err := h.service.RoundService.GetById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("round not found")
		default:
			h.logger.Error("failed to fetch round", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the round")
		}
	}

	if account := shared.GetAuthenticatedAccount(ctx); account.ID != round.Venture.Business.OwnerAccountID {
		h.logger.Error("business owner account id does not match authenticated account id",
			zap.Any("business owner account id", round.Venture.Business.OwnerAccountID),
			zap.Any("authenticated account id", account.ID))

		return nil, huma.Error403Forbidden("Cannot get investments for a round for a business you do not own")
	}

	investments, total, err := h.service.RoundService.GetInvestmentsByPage(ctx, input.ID, input.PageSize, input.Page, input.InvestmentFilter)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("investments not found")
		default:
			h.logger.Error("failed to fetch investments", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the investments")
		}
	}

	resp := &shared.GetOffsetPaginatedRoundInvestmentsOutput{}
	resp.Body.Message = "Investments fetched successfully"
	resp.Body.Investments = investments
	resp.Body.Total = total
	if len(investments) > input.PageSize {
		resp.Body.HasMore = true
		resp.Body.Investments = resp.Body.Investments[:len(resp.Body.Investments)-1]
	}

	return resp, nil
}

type GetByCursorInput struct {
	shared.CursorPaginationRequest
	round.RoundFilter
}

func (h *httpHandler) getByCursor(ctx context.Context, input *GetByCursorInput) (*shared.GetCursorPaginatedRoundsOutput, error) {
	limit := input.Limit + 1

	rounds, err := h.service.RoundService.GetByCursor(ctx, limit, input.Cursor, input.RoundFilter)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("rounds not found")
		default:
			h.logger.Error("failed to fetch investments", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the investments")
		}
	}

	resp := &shared.GetCursorPaginatedRoundsOutput{}
	resp.Body.Message = "Rounds fetched successfully"
	resp.Body.Rounds = rounds

	if len(rounds) == limit {
		resp.Body.NextCursor = &rounds[len(rounds)-1].ID
		resp.Body.HasMore = true
		resp.Body.Rounds = resp.Body.Rounds[:len(resp.Body.Rounds)-1]
	}

	return resp, nil
}

type GetByPageInput struct {
	shared.OffsetPaginationRequest
	round.RoundFilter
}

func (h *httpHandler) getByPage(ctx context.Context, input *GetByPageInput) (*shared.GetOffsetPaginatedRoundsOutput, error) {
	rounds, total, err := h.service.RoundService.GetByPage(ctx, input.PageSize, input.Page, input.RoundFilter)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("investments not found")
		default:
			h.logger.Error("failed to fetch investments", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the investments")
		}
	}

	resp := &shared.GetOffsetPaginatedRoundsOutput{}
	resp.Body.Message = "Rounds fetched successfully"
	resp.Body.Rounds = rounds
	resp.Body.Total = total

	if len(rounds) > input.PageSize {
		resp.Body.HasMore = true
		resp.Body.Rounds = resp.Body.Rounds[:len(resp.Body.Rounds)-1]
	}

	return resp, nil
}

func (h *httpHandler) getById(ctx context.Context, input *shared.PathIDParam) (*shared.SingleRoundResponse, error) {
	round, err := h.service.RoundService.GetById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("round not found")
		default:
			h.logger.Error("failed to fetch round", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the round")
		}
	}

	resp := &shared.SingleRoundResponse{}
	resp.Body.Message = "Round fetched successfully"
	resp.Body.Round = &round

	return resp, nil
}

type RoundLikeInput struct {
	shared.PathIDParam
	AccountID int `path:"accountId"`
}

func (h *httpHandler) createLike(ctx context.Context, input *RoundLikeInput) (*shared.MessageOutput, error) {
	account := shared.GetAuthenticatedAccount(ctx)

	if account.ID != input.AccountID {
		h.logger.Error("account id does not match authenticated account id",
			zap.Any("authenticated account id", account.ID),
			zap.Any("input account id", input.AccountID))

		return nil, huma.Error403Forbidden("Cannot like for another account")
	}

	roundRecord, err := h.service.RoundService.GetById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("Round not found")
		default:
			h.logger.Error("failed to fetch round", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the round")
		}
	}

	if account.ID != roundRecord.Venture.Business.OwnerAccountID {
		h.logger.Error("business owner account id does not match authenticated account id",
			zap.Any("business owner account id", roundRecord.Venture.Business.OwnerAccountID),
			zap.Any("authenticated account id", account.ID))

		return nil, huma.Error403Forbidden("Cannot like a round for a business you do not own")
	}

	_, err = h.service.RoundService.CreateLike(ctx, round.CreateRoundLikeParams{
		RoundID:   input.ID,
		AccountID: input.AccountID,
	})

	if err != nil {
		h.logger.Error("failed to create round like", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while creating the round like")
	}

	resp := &shared.MessageOutput{}
	resp.Body.Message = "Round like created successfully"

	return resp, nil
}

func (h *httpHandler) deleteLike(ctx context.Context, input *RoundLikeInput) (*shared.MessageOutput, error) {
	account := shared.GetAuthenticatedAccount(ctx)

	if account.ID != input.AccountID {
		h.logger.Error("account id does not match authenticated account id",
			zap.Any("authenticated account id", account.ID),
			zap.Any("input account id", input.AccountID))

		return nil, huma.Error403Forbidden("Cannot delete like for another account")
	}

	roundRecord, err := h.service.RoundService.GetById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("Round not found")
		default:
			h.logger.Error("failed to fetch round", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the round")
		}
	}

	if account.ID != roundRecord.Venture.Business.OwnerAccountID {
		h.logger.Error("business owner account id does not match authenticated account id",
			zap.Any("business owner account id", roundRecord.Venture.Business.OwnerAccountID),
			zap.Any("authenticated account id", account.ID))

		return nil, huma.Error403Forbidden("Cannot delete like for a round for a business you do not own")
	}

	err = h.service.RoundService.DeleteLike(ctx, input.ID, input.AccountID)
	if err != nil {
		h.logger.Error("failed to delete round like", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while deleting the round like")
	}

	resp := &shared.MessageOutput{}
	resp.Body.Message = "Round like deleted successfully"

	return resp, nil
}

// TODO: move to account handler
func (h *httpHandler) isLikedByAccount(ctx context.Context, input *RoundLikeInput) (*shared.IsLikedOutput, error) {
	account := shared.GetAuthenticatedAccount(ctx)

	if account.ID != input.AccountID {
		h.logger.Error("account id does not match authenticated account id",
			zap.Any("authenticated account id", account.ID),
			zap.Any("input account id", input.AccountID))

		return nil, huma.Error403Forbidden("Cannot check if round is liked by another account")
	}

	liked, err := h.service.RoundService.IsLikedByAccount(ctx, input.ID, input.AccountID)
	if err != nil {
		h.logger.Error("failed to check if round is liked by account", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while checking if the round is liked by the account")
	}

	resp := &shared.IsLikedOutput{}
	resp.Body.Message = "Round like status fetched successfully"
	resp.Body.Liked = liked

	return resp, nil
}

func (h *httpHandler) getLikeCount(ctx context.Context, input *shared.PathIDParam) (*shared.GetLikeCountOutput, error) {
	count, err := h.service.RoundService.GetLikeCount(ctx, input.ID)
	if err != nil {
		h.logger.Error("failed to get round like count", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while getting the round like count")
	}

	resp := &shared.GetLikeCountOutput{}
	resp.Body.Message = "Round like count fetched successfully"
	resp.Body.Count = count

	return resp, nil
}
