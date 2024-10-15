package business

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
		OperationID: "get-business-by-id",
		Method:      http.MethodGet,
		Path:        "/business/{id}",
		Summary:     "Get business by ID",
		Description: "Get business by ID.",
		Tags:        []string{"Businesses"},
	}, handler.getByID)

	huma.Register(humaApi, huma.Operation{
		OperationID: "create-business",
		Method:      http.MethodPost,
		Path:        "/business",
		Summary:     "Create a business",
		Description: "Create a business.",
		Tags:        []string{"Businesses"},
	}, handler.create)

	huma.Register(humaApi, huma.Operation{
		OperationID: "delete-business",
		Method:      http.MethodDelete,
		Path:        "/business/{id}",
		Summary:     "Delete a business",
		Description: "Delete a business.",
		Tags:        []string{"Businesses"},
	}, handler.delete)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-business-ventures-by-cursor",
		Method:      http.MethodGet,
		Path:        "/business/{id}/ventures",
		Summary:     "Get business ventures",
		Description: "Get all of the ventures owned by a given business.",
		Tags:        []string{"Businesses", "Ventures"},
	}, handler.getVenturesByCursor)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-business-ventures-by-page",
		Method:      http.MethodGet,
		Path:        "/business/{id}/ventures/page",
		Summary:     "Get business ventures",
		Description: "Get all of the ventures owned by a given business.",
		Tags:        []string{"Businesses", "Ventures"},
	}, handler.getVenturesByPage)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-business-investments-by-cursor",
		Method:      http.MethodGet,
		Path:        "/business/{id}/investments",
		Summary:     "Get recieved round investments",
		Description: "Get recieved round investments.",
		Tags:        []string{"Businesses", "Investments"},
	}, handler.getInvestmentsByCursor)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-business-investments-by-page",
		Method:      http.MethodGet,
		Path:        "/business/{id}/investments/page",
		Summary:     "Get recieved round investments",
		Description: "Get recieved round investments.",
		Tags:        []string{"Businesses", "Investments"},
	}, handler.getInvestmentsByPage)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-business-rounds-by-cursor",
		Method:      http.MethodGet,
		Path:        "/business/{id}/rounds",
		Summary:     "Get rounds",
		Description: "Get rounds.",
		Tags:        []string{"Businesses", "Rounds"},
	}, handler.getRoundsByCursor)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-business-rounds-by-page",
		Method:      http.MethodGet,
		Path:        "/business/{id}/rounds/page",
		Summary:     "Get rounds",
		Description: "Get rounds.",
		Tags:        []string{"Businesses", "Rounds"},
	}, handler.getRoundsByPage)
}
