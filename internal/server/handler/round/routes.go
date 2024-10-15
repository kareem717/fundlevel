package round

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

	handler := &httpHandler{
		service: service,
		logger:  logger,
	}

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-round-by-cursor",
		Method:      http.MethodGet,
		Path:        "/round",
		Summary:     "Get rounds by cursor",
		Description: "Get rounds by cursor.",
		Tags:        []string{"Round"},
	}, handler.getByCursor)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-rounds-by-page",
		Method:      http.MethodGet,
		Path:        "/round/page",
		Summary:     "Get rounds by page",
		Description: "Get rounds by page.",
		Tags:        []string{"Round"},
	}, handler.getByPage)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-round-by-id",
		Method:      http.MethodGet,
		Path:        "/round/{id}",
		Summary:     "Get round by ID",
		Description: "Get round by ID.",
		Tags:        []string{"Round"},
	}, handler.getById)

	huma.Register(humaApi, huma.Operation{
		OperationID: "create-round",
		Method:      http.MethodPost,
		Path:        "/round",
		Summary:     "Create a round",
		Description: "Create a round.",
		Tags:        []string{"Round"},
	}, handler.create)

	huma.Register(humaApi, huma.Operation{
		OperationID: "delete-round",
		Method:      http.MethodDelete,
		Path:        "/round/{id}",
		Summary:     "Delete a round",
		Description: "Delete a round.",
		Tags:        []string{"Round"},
	}, handler.delete)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-round-investments-by-cursor",
		Method:      http.MethodGet,
		Path:        "/round/{id}/investments",
		Summary:     "Get round investments",
		Description: "Get round investments.",
		Tags:        []string{"Round", "Investments"},
	}, handler.getInvestmentsByCursor)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-round-investments-by-page",
		Method:      http.MethodGet,
		Path:        "/round/{id}/investments/page",
		Summary:     "Get round investments",
		Description: "Get round investments.",
		Tags:        []string{"Round", "Investments"},
	}, handler.getInvestmentsByPage)

	huma.Register(humaApi, huma.Operation{
		OperationID: "accept-investment",
		Method:      http.MethodPost,
		Path:        "/round/{id}/investments/{investmentId}/accept",
		Summary:     "Accept an investment",
		Description: "Accept an investment.",
		Tags:        []string{"Round", "Investments"},
	}, handler.acceptInvestment)
}
