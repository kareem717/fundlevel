package health

import (
	"context"

	"fundlevel/internal/server/handler/shared"
	"fundlevel/internal/service"

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

type HealthCheckOutput struct {
	Body shared.MessageResponse
}

func (h *httpHandler) healthCheck(ctx context.Context, input *struct{}) (*HealthCheckOutput, error) {
	err := h.service.HealthService.HealthCheck(ctx)
	if err != nil {
		h.logger.Error("failed to health check", zap.Error(err))
	}

	resp := &HealthCheckOutput{}
	resp.Body.Message = "Health check passed"

	return resp, nil
}
