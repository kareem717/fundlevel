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
		roundService: service.RoundService,
		logger:         logger,
	}

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-round-by-id",
		Method:      http.MethodGet,
		Path:        "/round/{id}",
		Summary:     "Get round by ID",
		Description: "Get round by ID.",
		Tags:        []string{"Round"},
	}, handler.getByID)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-all-rounds",
		Method:      http.MethodGet,
		Path:        "/round",
		Summary:     "Get all rounds",
		Description: "Get all rounds.",
		Tags:        []string{"Round"},
	}, handler.getAll)

	huma.Register(humaApi, huma.Operation{
		OperationID: "create-round",
		Method:      http.MethodPost,
		Path:        "/round",
		Summary:     "Create a round",
		Description: "Create a round.",
		Tags:        []string{"Round"},
	}, handler.create)

	huma.Register(humaApi, huma.Operation{
		OperationID: "update-round",
		Method:      http.MethodPut,
		Path:        "/round/{id}",
		Summary:     "Update a round",
		Description: "Update a round.",
		Tags:        []string{"Round"},
	}, handler.update)

	huma.Register(humaApi, huma.Operation{
		OperationID: "delete-round",
		Method:      http.MethodDelete,
		Path:        "/round/{id}",
		Summary:     "Delete a round",
		Description: "Delete a round.",
		Tags:        []string{"Round"},
	}, handler.delete)

}
