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
		ventureService: service.VentureService,
		logger:         logger,
	}

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-venture-by-id",
		Method:      http.MethodGet,
		Path:        "/venture/{id}",
		Summary:     "Get venture by ID",
		Description: "Get venture by ID.",
		Tags:        []string{"Venture"},
	}, handler.getByID)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-all-ventures",
		Method:      http.MethodGet,
		Path:        "/venture",
		Summary:     "Get all ventures",
		Description: "Get all ventures.",
		Tags:        []string{"Venture"},
	}, handler.getAll)

	huma.Register(humaApi, huma.Operation{
		OperationID: "create-venture",
		Method:      http.MethodPost,
		Path:        "/venture",
		Summary:     "Create a venture",
		Description: "Create a venture.",
		Tags:        []string{"Venture"},
	}, handler.create)

	huma.Register(humaApi, huma.Operation{
		OperationID: "update-venture",
		Method:      http.MethodPut,
		Path:        "/venture/{id}",
		Summary:     "Update a venture",
		Description: "Update a venture.",
		Tags:        []string{"Venture"},
	}, handler.update)

	huma.Register(humaApi, huma.Operation{
		OperationID: "delete-venture",
		Method:      http.MethodDelete,
		Path:        "/venture/{id}",
		Summary:     "Delete a venture",
		Description: "Delete a venture.",
		Tags:        []string{"Venture"},
	}, handler.delete)

}
