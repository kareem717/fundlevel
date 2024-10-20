package venture

import (
	"context"
	"database/sql"
	"errors"

	"fundlevel/internal/entities/venture"
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

type SingleVentureResponse struct {
	Body struct {
		shared.MessageResponse
		Venture *venture.Venture `json:"venture"`
	}
}

func (h *httpHandler) getByID(ctx context.Context, input *shared.PathIDParam) (*SingleVentureResponse, error) {
	venture, err := h.service.VentureService.GetById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("venture not found")
		default:
			h.logger.Error("failed to fetch venture", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the venture")
		}
	}

	resp := &SingleVentureResponse{}
	resp.Body.Message = "Venture fetched successfully"
	resp.Body.Venture = &venture

	return resp, nil
}

func (h *httpHandler) getByPage(ctx context.Context, input *shared.OffsetPaginationRequest) (*shared.GetOffsetPaginatedVenturesOutput, error) {
	ventures, err := h.service.VentureService.GetByPage(ctx, input.PageSize, input.Page)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("ventures not found")
		default:
			h.logger.Error("failed to fetch ventures", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the ventures")
		}
	}

	resp := &shared.GetOffsetPaginatedVenturesOutput{}
	resp.Body.Message = "Ventures fetched successfully"
	resp.Body.Ventures = ventures

	if len(ventures) > input.PageSize {
		resp.Body.HasMore = true
		resp.Body.Ventures = resp.Body.Ventures[:input.PageSize]
	}

	return resp, nil
}

func (h *httpHandler) getByCursor(ctx context.Context, input *shared.CursorPaginationRequest) (*shared.GetCursorPaginatedVenturesOutput, error) {
	limit := input.Limit + 1
	ventures, err := h.service.VentureService.GetByCursor(ctx, limit, input.Cursor)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("ventures not found")
		default:
			h.logger.Error("failed to fetch ventures", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the ventures")
		}
	}

	resp := &shared.GetCursorPaginatedVenturesOutput{}
	resp.Body.Message = "Ventures fetched successfully"
	resp.Body.Ventures = ventures

	if len(ventures) == limit {
		resp.Body.NextCursor = &ventures[input.Limit].ID
		resp.Body.HasMore = true
		resp.Body.Ventures = resp.Body.Ventures[:input.Limit]
	}

	return resp, nil
}

func (h *httpHandler) getRoundsByPage(ctx context.Context, input *shared.GetRoundsByParentAndPageInput) (*shared.GetOffsetPaginatedRoundsOutput, error) {
	rounds, total, err := h.service.VentureService.GetRoundsByPage(ctx, input.ID, input.PageSize, input.Page, input.RoundFilter)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("rounds not found")
		default:
			h.logger.Error("failed to fetch rounds", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the rounds")
		}
	}

	resp := &shared.GetOffsetPaginatedRoundsOutput{}
	resp.Body.Message = "Rounds fetched successfully"
	resp.Body.Rounds = rounds
	resp.Body.Total = total
	if len(rounds) > input.PageSize {
		resp.Body.HasMore = true
		resp.Body.Rounds = resp.Body.Rounds[:input.PageSize]
	}

	return resp, nil
}


func (h *httpHandler) getRoundsByCursor(ctx context.Context, input *shared.GetRoundsByParentAndCursorInput) (*shared.GetCursorPaginatedRoundsOutput, error) {
	limit := input.Limit + 1

	rounds, err := h.service.VentureService.GetRoundsByCursor(ctx, input.ID, limit, input.Cursor, input.RoundFilter)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("rounds not found")
		default:
			h.logger.Error("failed to fetch rounds", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the rounds")
		}
	}

	resp := &shared.GetCursorPaginatedRoundsOutput{}
	resp.Body.Message = "Rounds fetched successfully"
	resp.Body.Rounds = rounds

	if len(rounds) == limit {
		resp.Body.NextCursor = &rounds[input.Limit].ID
		resp.Body.HasMore = true
		resp.Body.Rounds = resp.Body.Rounds[:input.Limit]
	}

	return resp, nil
}

func (h *httpHandler) getOffsetPaginatedRoundInvestments(ctx context.Context, input *shared.GetOffsetPaginatedByParentPathIDInput) (*shared.GetOffsetPaginatedRoundInvestmentsOutput, error) {
	rounds, err := h.service.VentureService.GetInvestmentsByPage(ctx, input.ID, input.PageSize, input.Page)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("round investments not found")
		default:
			h.logger.Error("failed to fetch round investments", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the round investments")
		}
	}

	resp := &shared.GetOffsetPaginatedRoundInvestmentsOutput{}
	resp.Body.Message = "Round investments fetched successfully"
	resp.Body.Investments = rounds

	if len(rounds) > input.PageSize {
		resp.Body.HasMore = true
		resp.Body.Investments = resp.Body.Investments[:input.PageSize]
	}

	return resp, nil
}

func (h *httpHandler) getCursorPaginatedRoundInvestments(ctx context.Context, input *shared.GetCursorPaginatedByParentPathIDInput) (*shared.GetCursorPaginatedRoundInvestmentsOutput, error) {
	limit := input.Limit + 1

	rounds, err := h.service.VentureService.GetInvestmentsByCursor(ctx, input.ID, limit, input.Cursor)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("rounds not found")
		default:
			h.logger.Error("failed to fetch rounds", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the round investments")
		}
	}

	resp := &shared.GetCursorPaginatedRoundInvestmentsOutput{}
	resp.Body.Message = "Round investments fetched successfully"
	resp.Body.Investments = rounds

	if len(rounds) == limit {
		resp.Body.NextCursor = &rounds[input.Limit].Round.ID
		resp.Body.HasMore = true
		resp.Body.Investments = resp.Body.Investments[:input.Limit]
	}

	return resp, nil
}

type CreateVentureInput struct {
	Body venture.CreateVentureParams `json:"venture"`
}

func (h *httpHandler) create(ctx context.Context, input *CreateVentureInput) (*SingleVentureResponse, error) {
	business, err := h.service.BusinessService.GetById(ctx, input.Body.BusinessID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, huma.Error404NotFound("Business not found")
		}

		h.logger.Error("failed to fetch business", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while fetching the business")
	}

	if account := shared.GetAuthenticatedAccount(ctx); account.ID != business.OwnerAccountID {
		h.logger.Error("input account id does not match authenticated account id",
			zap.Any("input account id", business.OwnerAccountID),
			zap.Any("authenticated account id", account.ID))

		return nil, huma.Error403Forbidden("Cannot create venture for business you do not own")
	}

	venture, err := h.service.VentureService.Create(ctx, input.Body)
	if err != nil {
		h.logger.Error("failed to create venture", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while creating the venture")
	}

	resp := &SingleVentureResponse{}
	resp.Body.Message = "Venture created successfully"
	resp.Body.Venture = &venture

	return resp, nil
}

type UpdateVentureInput struct {
	shared.PathIDParam
	Body venture.UpdateVentureParams `json:"venture"`
}

func (h *httpHandler) update(ctx context.Context, input *UpdateVentureInput) (*SingleVentureResponse, error) {
	ventureRecord, err := h.service.VentureService.GetById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("venture not found")
		default:
			h.logger.Error("failed to fetch venture", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the venture")
		}
	}

	business, err := h.service.BusinessService.GetById(ctx, ventureRecord.BusinessID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, huma.Error404NotFound("Business not found")
		}

		h.logger.Error("failed to fetch business", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while fetching the business")
	}

	if account := shared.GetAuthenticatedAccount(ctx); account.ID != business.OwnerAccountID {
		h.logger.Error("input account id does not match authenticated account id",
			zap.Any("input account id", business.OwnerAccountID),
			zap.Any("authenticated account id", account.ID))

		return nil, huma.Error403Forbidden("Cannot update venture for business you do not own")
	}

	venture, err := h.service.VentureService.Update(ctx, input.ID, input.Body)

	if err != nil {
		h.logger.Error("failed to update venture", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while updating the venture")
	}

	resp := &SingleVentureResponse{}
	resp.Body.Message = "Venture updated successfully"
	resp.Body.Venture = &venture

	return resp, nil
}

type DeleteVentureOutput struct {
	Body shared.MessageResponse
}

func (h *httpHandler) delete(ctx context.Context, input *shared.PathIDParam) (*DeleteVentureOutput, error) {
	ventureRecord, err := h.service.VentureService.GetById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("venture not found")
		default:
			h.logger.Error("failed to fetch venture", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the venture")
		}
	}

	business, err := h.service.BusinessService.GetById(ctx, ventureRecord.BusinessID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, huma.Error404NotFound("Business not found")
		}

		h.logger.Error("failed to fetch business", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while fetching the business")
	}

	if account := shared.GetAuthenticatedAccount(ctx); account.ID != business.OwnerAccountID {
		h.logger.Error("input account id does not match authenticated account id",
			zap.Any("input account id", business.OwnerAccountID),
			zap.Any("authenticated account id", account.ID))

		return nil, huma.Error403Forbidden("Cannot delete venture for business you do not own")
	}

	err = h.service.VentureService.Delete(ctx, input.ID)
	if err != nil {
		h.logger.Error("failed to delete venture", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while deleting the venture")
	}

	resp := &DeleteVentureOutput{}
	resp.Body.Message = "Venture deleted successfully"

	return resp, nil
}

type VentureLikeInput struct {
	shared.PathIDParam
	AccountID int `path:"accountId"`
}

func (h *httpHandler) createLike(ctx context.Context, input *VentureLikeInput) (*shared.MessageOutput, error) {
	_, err := h.service.VentureService.CreateLike(ctx, venture.CreateVentureLikeParams{
		VentureID: input.ID,
		AccountID: input.AccountID,
	})

	if account := shared.GetAuthenticatedAccount(ctx); account.ID != input.AccountID {
		h.logger.Error("input account id does not match authenticated account id",
			zap.Any("input account id", input.AccountID),
			zap.Any("authenticated account id", account.ID))

		return nil, huma.Error403Forbidden("Cannot create like for another account")
	}

	if err != nil {
		h.logger.Error("failed to create venture like", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while creating the venture like")
	}

	resp := &shared.MessageOutput{}
	resp.Body.Message = "Venture like created successfully"

	return resp, nil
}

func (h *httpHandler) deleteLike(ctx context.Context, input *VentureLikeInput) (*shared.MessageOutput, error) {
	err := h.service.VentureService.DeleteLike(ctx, input.ID, input.AccountID)
	if err != nil {
		h.logger.Error("failed to delete venture like", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while deleting the venture like")
	}

	if account := shared.GetAuthenticatedAccount(ctx); account.ID != input.AccountID {
		h.logger.Error("input account id does not match authenticated account id",
			zap.Any("input account id", input.AccountID),
			zap.Any("authenticated account id", account.ID))

		return nil, huma.Error403Forbidden("Cannot create like for another account")
	}

	resp := &shared.MessageOutput{}
	resp.Body.Message = "Venture like deleted successfully"

	return resp, nil
}

func (h *httpHandler) getLikeCount(ctx context.Context, input *shared.PathIDParam) (*shared.GetLikeCountOutput, error) {
	count, err := h.service.VentureService.GetLikeCount(ctx, input.ID)
	if err != nil {
		h.logger.Error("failed to get venture like count", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while getting the venture like count")
	}

	resp := &shared.GetLikeCountOutput{}
	resp.Body.Message = "Venture like count fetched successfully"
	resp.Body.Count = count

	return resp, nil
}

func (h *httpHandler) isLikedByAccount(ctx context.Context, input *VentureLikeInput) (*shared.IsLikedOutput, error) {
	liked, err := h.service.VentureService.IsLikedByAccount(ctx, input.ID, input.AccountID)
	if err != nil {
		h.logger.Error("failed to check if venture is liked by account", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while checking if the venture is liked by the account")
	}

	if account := shared.GetAuthenticatedAccount(ctx); account.ID != input.AccountID {
		h.logger.Error("input account id does not match authenticated account id",
			zap.Any("input account id", input.AccountID),
			zap.Any("authenticated account id", account.ID))

		return nil, huma.Error403Forbidden("Cannot create like for another account")
	}

	resp := &shared.IsLikedOutput{}
	resp.Body.Message = "Venture like status fetched successfully"
	resp.Body.Liked = liked

	return resp, nil
}

func (h *httpHandler) getActiveRound(ctx context.Context, input *shared.PathIDParam) (*shared.SingleRoundResponse, error) {
	round, err := h.service.VentureService.GetActiveRound(ctx, input.ID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			resp := &shared.SingleRoundResponse{}
			resp.Body.Message = "No active round found"
			return resp, nil
		}
		h.logger.Error("failed to get active round", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while getting the active round")
	}

	resp := &shared.SingleRoundResponse{}
	resp.Body.Message = "Active round fetched successfully"
	resp.Body.Round = &round

	return resp, nil
}
