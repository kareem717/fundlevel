package health

import (
	"net/http"

	"ummah-growth/api/internal/service"

	"github.com/danielgtaylor/huma/v2"
	"go.uber.org/zap"
)

func RegisterHumaRoutes(
	service *service.Service,
	humaApi huma.API,
	logger *zap.Logger,
) {

	handler := &httpHandler{
		healthService: service.HealthService,
		logger:        logger,
	}

	huma.Register(humaApi, huma.Operation{
		OperationID: "health-check",
		Method:      http.MethodGet,
		Path:        "/health",
		Summary:     "Health check",
		Description: "Health check.",
		Tags:        []string{"Health"},
	}, handler.healthCheck)
}
