package venture

import (
	"context"
	"database/sql"
	"errors"

	"fundlevel/internal/entities/round"
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

func (h *httpHandler) getMany(ctx context.Context, input *shared.PaginationRequest) (*shared.GetManyVenturesOutput, error) {
	LIMIT := input.Limit + 1

	var ventures []venture.Venture
	var err error

	if input.CursorPagination != nil {
		ventures, err = h.service.VentureService.GetManyByCursor(ctx, LIMIT, input.Cursor)
	} else {
		ventures, err = h.service.VentureService.GetManyByPage(ctx, LIMIT, input.Cursor)
	}

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("ventures not found")
		default:
			h.logger.Error("failed to fetch ventures", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the ventures")
		}
	}

	resp := &shared.GetManyVenturesOutput{}
	resp.Body.Message = "Ventures fetched successfully"
	resp.Body.Ventures = ventures

	if len(ventures) == LIMIT {
		resp.Body.NextCursor = &ventures[len(ventures)-1].ID
		resp.Body.HasMore = true
		resp.Body.Ventures = resp.Body.Ventures[:len(resp.Body.Ventures)-1]
	}

	return resp, nil
}

func (h *httpHandler) getRounds(ctx context.Context, input *shared.GetManyByParentPathIDInput) (*shared.GetManyFixedTotalRoundsOutput, error) {
	LIMIT := input.Limit + 1

	var rounds []round.FixedTotalRound
	var err error

	if input.CursorPagination != nil {
		rounds, err = h.service.VentureService.GetFixedTotalRoundsByCursor(ctx, input.ID, LIMIT, input.Cursor)
	} else {
		rounds, err = h.service.VentureService.GetFixedTotalRoundsByPage(ctx, input.ID, LIMIT, input.Cursor)
	}

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("rounds not found")
		default:
			h.logger.Error("failed to fetch rounds", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the rounds")
		}
	}

	resp := &shared.GetManyFixedTotalRoundsOutput{}
	resp.Body.Message = "Rounds fetched successfully"
	resp.Body.FixedTotalRounds = rounds

	if len(rounds) == LIMIT {
		resp.Body.NextCursor = &rounds[len(rounds)-1].Round.ID
		resp.Body.HasMore = true
		resp.Body.FixedTotalRounds = resp.Body.FixedTotalRounds[:len(resp.Body.FixedTotalRounds)-1]
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
