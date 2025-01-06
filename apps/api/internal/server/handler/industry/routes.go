package industry

import (
	"net/http"

	"fundlevel/internal/service"
	"github.com/danielgtaylor/huma/v2"
	"go.uber.org/zap"
)

func RegisterHumaRoutes(
	service *service.Service,
	humaApi huma.API,
	logger *zap.Logger,
) {

	handler := newHTTPHandler(service, logger)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-all-industries",
		Method:      http.MethodGet,
		Path:        "/industries",
		Summary:     "Get all industries",
		Description: "Get all industries.",
		Tags:        []string{"Industries"},
	}, handler.getAll)
}
