package offer

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
		OperationID: "get-offer-by-id",
		Method:      http.MethodGet,
		Path:        "/offer/{id}",
		Summary:     "Get offer by ID",
		Description: "Get offer by ID.",
		Tags:        []string{"Offers"},
	}, handler.getByID)
	
	huma.Register(humaApi, huma.Operation{
		OperationID: "create-offer",
		Method:      http.MethodPost,
		Path:        "/offer",
		Summary:     "Create a offer",
		Description: "Create a offer.",
		Tags:        []string{"Offers"},
	}, handler.create)

	huma.Register(humaApi, huma.Operation{
		OperationID: "update-offer-status",
		Method:      http.MethodPut,
		Path:        "/offer/{id}",
		Summary:     "Update a offer status",
		Description: "Update a offer status.",
		Tags:        []string{"Offers"},
	}, handler.updateStatus)

	huma.Register(humaApi, huma.Operation{
		OperationID: "delete-offer",
		Method:      http.MethodDelete,
		Path:        "/offer/{id}",
		Summary:     "Delete a offer",
		Description: "Delete a offer.",
		Tags:        []string{"Offers"},
	}, handler.delete)

}
