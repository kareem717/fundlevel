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
		OperationID: "get-all-ventures-offset",
		Method:      http.MethodGet,
		Path:        "/venture/offset",
		Summary:     "Get offset paginated ventures",
		Description: "Get offset paginated ventures.",
		Tags:        []string{"Ventures"},
	}, handler.getOffsetPaginated)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-all-ventures-cursor",
		Method:      http.MethodGet,
		Path:        "/venture/cursor",
		Summary:     "Get cursor paginated ventures",
		Description: "Get cursor paginated ventures.",
		Tags:        []string{"Ventures"},
	}, handler.getCursorPaginated)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-venture-fixed-total-rounds-cursor",
		Method:      http.MethodGet,
		Path:        "/venture/{id}/rounds/fixed/total/cursor",
		Summary:     "Get cursor paginated rounds for a venture",
		Description: "Get all rounds for a venture.",
		Tags:        []string{"Ventures", "Fixed Total Rounds"},
	}, handler.getCursorPaginatedFixedTotalRounds)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-venture-fixed-total-rounds-offset",
		Method:      http.MethodGet,
		Path:        "/venture/{id}/rounds/fixed/total/offset",
		Summary:     "Get offset paginated rounds for a venture",
		Description: "Get all rounds for a venture.",
		Tags:        []string{"Ventures", "Fixed Total Rounds"},
	}, handler.getOffsetPaginatedFixedTotalRounds)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-venture-regular-dynamic-rounds-cursor",
		Method:      http.MethodGet,
		Path:        "/venture/{id}/rounds/regular/dynamic/cursor",
		Summary:     "Get cursor paginated rounds for a venture",
		Description: "Get all rounds for a venture.",
		Tags:        []string{"Ventures", "Regular Dynamic Rounds"},
	}, handler.getCursorPaginatedRegularDynamicRounds)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-venture-regular-dynamic-rounds-offset",
		Method:      http.MethodGet,
		Path:        "/venture/{id}/rounds/regular/dynamic/offset",
		Summary:     "Get offset paginated rounds for a venture",
		Description: "Get all rounds for a venture.",
		Tags:        []string{"Ventures", "Regular Dynamic Rounds"},
	}, handler.getOffsetPaginatedRegularDynamicRounds)

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
