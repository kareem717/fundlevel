package venture

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
		OperationID: "get-venture-by-id",
		Method:      http.MethodGet,
		Path:        "/venture/{id}",
		Summary:     "Get venture by ID",
		Description: "Get venture by ID.",
		Tags:        []string{"Ventures"},
	}, handler.getByID)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-all-ventures",
		Method:      http.MethodGet,
		Path:        "/venture",
		Summary:     "Get all ventures",
		Description: "Get all ventures.",
		Tags:        []string{"Ventures"},
	}, handler.getMany)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-venture-rounds",
		Method:      http.MethodGet,
		Path:        "/venture/{id}/rounds",
		Summary:     "Get all rounds for a venture",
		Description: "Get all rounds for a venture.",
		Tags:        []string{"Ventures", "Rounds"},
	}, handler.getRounds)
	
	huma.Register(humaApi, huma.Operation{
		OperationID: "create-venture",
		Method:      http.MethodPost,
		Path:        "/venture",
		Summary:     "Create a venture",
		Description: "Create a venture.",
		Tags:        []string{"Ventures"},
	}, handler.create)

	huma.Register(humaApi, huma.Operation{
		OperationID: "update-venture",
		Method:      http.MethodPut,
		Path:        "/venture/{id}",
		Summary:     "Update a venture",
		Description: "Update a venture.",
		Tags:        []string{"Ventures"},
	}, handler.update)

	huma.Register(humaApi, huma.Operation{
		OperationID: "delete-venture",
		Method:      http.MethodDelete,
		Path:        "/venture/{id}",
		Summary:     "Delete a venture",
		Description: "Delete a venture.",
		Tags:        []string{"Ventures"},
	}, handler.delete)

}
