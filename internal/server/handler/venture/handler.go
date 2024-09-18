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
	ventureService service.VentureService
	logger         *zap.Logger
}

func newHTTPHandler(ventureService service.VentureService, logger *zap.Logger) *httpHandler {
	return &httpHandler{
		ventureService: ventureService,
		logger:         logger,
	}
}

type SingleventureResponse struct {
	Body struct {
		shared.MessageResponse
		Venture *venture.Venture `json:"venture"`
	}
}

func (h *httpHandler) getByID(ctx context.Context, input *shared.PathIDParam) (*SingleventureResponse, error) {
	venture, err := h.ventureService.GetById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("venture not found")
		default:
			h.logger.Error("failed to fetch venture", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the venture")
		}
	}

	resp := &SingleventureResponse{}
	resp.Body.Message = "venture fetched successfully"
	resp.Body.Venture = &venture

	return resp, nil
}

type GetAllventureOutput struct {
	Body struct {
		shared.MessageResponse
		Ventures []venture.Venture `json:"ventures"`
		shared.PaginationResponse
	}
}

func (h *httpHandler) getAll(ctx context.Context, input *shared.PaginationRequest) (*GetAllventureOutput, error) {
	LIMIT := input.Limit + 1

	ventures, err := h.ventureService.GetAll(ctx, LIMIT, input.Cursor)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("ventures not found")
		default:
			h.logger.Error("failed to fetch ventures", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the ventures")
		}
	}

	resp := &GetAllventureOutput{}
	resp.Body.Message = "ventures fetched successfully"
	resp.Body.Ventures = ventures

	if len(ventures) == LIMIT {
		resp.Body.NextCursor = &ventures[len(ventures)-1].ID
		resp.Body.HasMore = true
		resp.Body.Ventures = resp.Body.Ventures[:len(resp.Body.Ventures)-1]
	}

	return resp, nil
}

type CreateventureInput struct {
	Body venture.CreateVentureParams `json:"venture"`
}

func (h *httpHandler) create(ctx context.Context, input *CreateventureInput) (*SingleventureResponse, error) {
	venture, err := h.ventureService.Create(ctx, input.Body)
	if err != nil {
		h.logger.Error("failed to create venture", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while creating the venture")
	}

	resp := &SingleventureResponse{}
	resp.Body.Message = "venture created successfully"
	resp.Body.Venture = &venture

	return resp, nil
}

type UpdateventureInput struct {
	shared.PathIDParam
	Body venture.UpdateVentureParams `json:"venture"`
}

func (h *httpHandler) update(ctx context.Context, input *UpdateventureInput) (*SingleventureResponse, error) {
	_, err := h.ventureService.GetById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("venture not found")
		default:
			h.logger.Error("failed to fetch venture", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the venture")
		}
	}

	venture, err := h.ventureService.Update(ctx, input.ID, input.Body)

	if err != nil {
		h.logger.Error("failed to update venture", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while updating the venture")
	}

	resp := &SingleventureResponse{}
	resp.Body.Message = "venture updated successfully"
	resp.Body.Venture = &venture

	return resp, nil
}

type DeleteventureResponse struct {
	Body shared.MessageResponse
}

func (h *httpHandler) delete(ctx context.Context, input *shared.PathIDParam) (*DeleteventureResponse, error) {
	_, err := h.ventureService.GetById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("venture not found")
		default:
			h.logger.Error("failed to fetch venture", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the venture")
		}
	}

	err = h.ventureService.Delete(ctx, input.ID)
	if err != nil {
		h.logger.Error("failed to delete venture", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while deleting the venture")
	}

	resp := &DeleteventureResponse{}
	resp.Body.Message = "venture deleted successfully"

	return resp, nil
}
