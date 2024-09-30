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

func (h *httpHandler) getOffsetPaginated(ctx context.Context, input *shared.OffsetPaginationRequest) (*shared.GetOffsetPaginatedVenturesOutput, error) {
	ventures, err := h.service.VentureService.GetManyByPage(ctx, input.PageSize, input.Page)

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

func (h *httpHandler) getCursorPaginated(ctx context.Context, input *shared.CursorPaginationRequest) (*shared.GetCursorPaginatedVenturesOutput, error) {
	limit := input.Limit + 1
	ventures, err := h.service.VentureService.GetManyByCursor(ctx, limit, input.Cursor)

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

func (h *httpHandler) getOffsetPaginatedFixedTotalRounds(ctx context.Context, input *shared.GetOffsetPaginatedByParentPathIDInput) (*shared.GetOffsetPaginatedFixedTotalRoundsOutput, error) {
	rounds, err := h.service.VentureService.GetFixedTotalRoundsByPage(ctx, input.ID, input.PageSize, input.Page)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("rounds not found")
		default:
			h.logger.Error("failed to fetch rounds", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the rounds")
		}
	}

	resp := &shared.GetOffsetPaginatedFixedTotalRoundsOutput{}
	resp.Body.Message = "Rounds fetched successfully"
	resp.Body.FixedTotalRounds = rounds

	if len(rounds) > input.PageSize {
		resp.Body.HasMore = true
		resp.Body.FixedTotalRounds = resp.Body.FixedTotalRounds[:input.PageSize]
	}

	return resp, nil
}

func (h *httpHandler) getCursorPaginatedFixedTotalRounds(ctx context.Context, input *shared.GetCursorPaginatedByParentPathIDInput) (*shared.GetCursorPaginatedFixedTotalRoundsOutput, error) {
	limit := input.Limit + 1

	rounds, err := h.service.VentureService.GetFixedTotalRoundsByCursor(ctx, input.ID, limit, input.Cursor)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("rounds not found")
		default:
			h.logger.Error("failed to fetch rounds", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the rounds")
		}
	}

	resp := &shared.GetCursorPaginatedFixedTotalRoundsOutput{}
	resp.Body.Message = "Rounds fetched successfully"
	resp.Body.FixedTotalRounds = rounds

	if len(rounds) == limit {
		resp.Body.NextCursor = &rounds[input.Limit].Round.ID
		resp.Body.HasMore = true
		resp.Body.FixedTotalRounds = resp.Body.FixedTotalRounds[:input.Limit]
	}

	return resp, nil
}

func (h *httpHandler) getOffsetPaginatedRegularDynamicRounds(ctx context.Context, input *shared.GetOffsetPaginatedByParentPathIDInput) (*shared.GetOffsetPaginatedRegularDynamicRoundsOutput, error) {
	rounds, err := h.service.VentureService.GetRegularDynamicRoundsByPage(ctx, input.ID, input.PageSize, input.Page)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("rounds not found")
		default:
			h.logger.Error("failed to fetch rounds", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the rounds")
		}
	}

	resp := &shared.GetOffsetPaginatedRegularDynamicRoundsOutput{}
	resp.Body.Message = "Rounds fetched successfully"
	resp.Body.RegularDynamicRounds = rounds

	if len(rounds) > input.PageSize {
		resp.Body.HasMore = true
		resp.Body.RegularDynamicRounds = resp.Body.RegularDynamicRounds[:input.PageSize]
	}

	return resp, nil
}

func (h *httpHandler) getCursorPaginatedRegularDynamicRounds(ctx context.Context, input *shared.GetCursorPaginatedByParentPathIDInput) (*shared.GetCursorPaginatedRegularDynamicRoundsOutput, error) {
	limit := input.Limit + 1

	rounds, err := h.service.VentureService.GetRegularDynamicRoundsByCursor(ctx, input.ID, limit, input.Cursor)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("rounds not found")
		default:
			h.logger.Error("failed to fetch rounds", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the rounds")
		}
	}

	resp := &shared.GetCursorPaginatedRegularDynamicRoundsOutput{}
	resp.Body.Message = "Rounds fetched successfully"
	resp.Body.RegularDynamicRounds = rounds

	if len(rounds) == limit {
		resp.Body.NextCursor = &rounds[input.Limit].Round.ID
		resp.Body.HasMore = true
		resp.Body.RegularDynamicRounds = resp.Body.RegularDynamicRounds[:input.Limit]
	}

	return resp, nil
}

func (h *httpHandler) getOffsetPaginatedPartialTotalRounds(ctx context.Context, input *shared.GetOffsetPaginatedByParentPathIDInput) (*shared.GetOffsetPaginatedPartialTotalRoundsOutput, error) {
	rounds, err := h.service.VentureService.GetPartialTotalRoundsByPage(ctx, input.ID, input.PageSize, input.Page)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("rounds not found")
		default:
			h.logger.Error("failed to fetch rounds", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the rounds")
		}
	}

	resp := &shared.GetOffsetPaginatedPartialTotalRoundsOutput{}
	resp.Body.Message = "Rounds fetched successfully"
	resp.Body.PartialTotalRounds = rounds

	if len(rounds) > input.PageSize {
		resp.Body.HasMore = true
		resp.Body.PartialTotalRounds = resp.Body.PartialTotalRounds[:input.PageSize]
	}

	return resp, nil
}

func (h *httpHandler) getCursorPaginatedPartialTotalRounds(ctx context.Context, input *shared.GetCursorPaginatedByParentPathIDInput) (*shared.GetCursorPaginatedPartialTotalRoundsOutput, error) {
	limit := input.Limit + 1

	rounds, err := h.service.VentureService.GetPartialTotalRoundsByCursor(ctx, input.ID, limit, input.Cursor)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("rounds not found")
		default:
			h.logger.Error("failed to fetch rounds", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the rounds")
		}
	}

	resp := &shared.GetCursorPaginatedPartialTotalRoundsOutput{}
	resp.Body.Message = "Rounds fetched successfully"
	resp.Body.PartialTotalRounds = rounds

	if len(rounds) == limit {
		resp.Body.NextCursor = &rounds[input.Limit].Round.ID
		resp.Body.HasMore = true
		resp.Body.PartialTotalRounds = resp.Body.PartialTotalRounds[:input.Limit]
	}

	return resp, nil
}

func (h *httpHandler) getOffsetPaginatedDutchDynamicRounds(ctx context.Context, input *shared.GetOffsetPaginatedByParentPathIDInput) (*shared.GetOffsetPaginatedDutchDynamicRoundsOutput, error) {
	rounds, err := h.service.VentureService.GetDutchDynamicRoundsByPage(ctx, input.ID, input.PageSize, input.Page)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("rounds not found")
		default:
			h.logger.Error("failed to fetch rounds", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the rounds")
		}
	}

	resp := &shared.GetOffsetPaginatedDutchDynamicRoundsOutput{}
	resp.Body.Message = "Rounds fetched successfully"
	resp.Body.DutchDynamicRounds = rounds

	if len(rounds) > input.PageSize {
		resp.Body.HasMore = true
		resp.Body.DutchDynamicRounds = resp.Body.DutchDynamicRounds[:input.PageSize]
	}

	return resp, nil
}

func (h *httpHandler) getCursorPaginatedDutchDynamicRounds(ctx context.Context, input *shared.GetCursorPaginatedByParentPathIDInput) (*shared.GetCursorPaginatedDutchDynamicRoundsOutput, error) {
	limit := input.Limit + 1

	rounds, err := h.service.VentureService.GetDutchDynamicRoundsByCursor(ctx, input.ID, limit, input.Cursor)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("rounds not found")
		default:
			h.logger.Error("failed to fetch rounds", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the rounds")
		}
	}

	resp := &shared.GetCursorPaginatedDutchDynamicRoundsOutput{}
	resp.Body.Message = "Rounds fetched successfully"
	resp.Body.DutchDynamicRounds = rounds

	if len(rounds) == limit {
		resp.Body.NextCursor = &rounds[input.Limit].Round.ID
		resp.Body.HasMore = true
		resp.Body.DutchDynamicRounds = resp.Body.DutchDynamicRounds[:input.Limit]
	}

	return resp, nil
}

func (h *httpHandler) getOffsetPaginatedRoundInvestments(ctx context.Context, input *shared.GetOffsetPaginatedByParentPathIDInput) (*shared.GetOffsetPaginatedRoundInvestmentsOutput, error) {
	rounds, err := h.service.VentureService.GetVentureRoundInvestmentsByPage(ctx, input.ID, input.PageSize, input.Page)

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

	rounds, err := h.service.VentureService.GetVentureRoundInvestmentsByCursor(ctx, input.ID, limit, input.Cursor)

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
	_, err := h.service.VentureService.GetById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("venture not found")
		default:
			h.logger.Error("failed to fetch venture", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the venture")
		}
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
	_, err := h.service.VentureService.GetById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("venture not found")
		default:
			h.logger.Error("failed to fetch venture", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the venture")
		}
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
