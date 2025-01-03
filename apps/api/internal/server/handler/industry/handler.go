package industry

import (
	"context"
	"database/sql"
	"errors"

	"fundlevel/internal/entities/industry"
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

type getAllIndustriesResponse struct {
	Body struct {
		shared.MessageResponse
		Industries []industry.Industry `json:"industries"`
	}
}

func (h *httpHandler) getAll(ctx context.Context, input *struct{}) (*getAllIndustriesResponse, error) {
	industries, err := h.service.IndustryService.GetAll(ctx)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("Industries not found")
		default:
			h.logger.Error("failed to fetch industries", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the industries")
		}
	}

	resp := &getAllIndustriesResponse{}
	resp.Body.Message = "Industries fetched successfully"
	resp.Body.Industries = industries

	return resp, nil
}
