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
		OperationID: "get-venture-rounds-cursor",
		Method:      http.MethodGet,
		Path:        "/venture/{id}/rounds/cursor",
		Summary:     "Get cursor paginated rounds for a venture",
		Description: "Get all rounds for a venture.",
		Tags:        []string{"Ventures", "Rounds"},
	}, handler.getCursorPaginatedFixedTotalRounds)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-venture-rounds-offset",
		Method:      http.MethodGet,
		Path:        "/venture/{id}/rounds/offset",
		Summary:     "Get offset paginated rounds for a venture",
		Description: "Get all rounds for a venture.",
		Tags:        []string{"Ventures", "Rounds"},
	}, handler.getCursorPaginatedFixedTotalRounds)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-venture-fixed-total-rounds-cursor",
		Method:      http.MethodGet,
		Path:        "/venture/{id}/rounds/total/fixed/cursor",
		Summary:     "Get cursor paginated rounds for a venture",
		Description: "Get all rounds for a venture.",
		Tags:        []string{"Ventures", "Fixed Total Rounds"},
	}, handler.getCursorPaginatedFixedTotalRounds)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-venture-fixed-total-rounds-offset",
		Method:      http.MethodGet,
		Path:        "/venture/{id}/rounds/total/fixed/offset",
		Summary:     "Get offset paginated rounds for a venture",
		Description: "Get all rounds for a venture.",
		Tags:        []string{"Ventures", "Fixed Total Rounds"},
	}, handler.getOffsetPaginatedFixedTotalRounds)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-venture-regular-dynamic-rounds-cursor",
		Method:      http.MethodGet,
		Path:        "/venture/{id}/rounds/dynamic/regular/cursor",
		Summary:     "Get cursor paginated rounds for a venture",
		Description: "Get all rounds for a venture.",
		Tags:        []string{"Ventures", "Regular Dynamic Rounds"},
	}, handler.getCursorPaginatedRegularDynamicRounds)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-venture-regular-dynamic-rounds-offset",
		Method:      http.MethodGet,
		Path:        "/venture/{id}/rounds/dynamic/regular/offset",
		Summary:     "Get offset paginated rounds for a venture",
		Description: "Get all rounds for a venture.",
		Tags:        []string{"Ventures", "Regular Dynamic Rounds"},
	}, handler.getOffsetPaginatedRegularDynamicRounds)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-venture-partial-total-rounds-cursor",
		Method:      http.MethodGet,
		Path:        "/venture/{id}/rounds/total/partial/cursor",
		Summary:     "Get cursor paginated rounds for a venture",
		Description: "Get all rounds for a venture.",
		Tags:        []string{"Ventures", "Partial Total Rounds"},
	}, handler.getCursorPaginatedPartialTotalRounds)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-venture-partial-total-rounds-offset",
		Method:      http.MethodGet,
		Path:        "/venture/{id}/rounds/total/partial/offset",
		Summary:     "Get offset paginated rounds for a venture",
		Description: "Get all rounds for a venture.",
		Tags:        []string{"Ventures", "Partial Total Rounds"},
	}, handler.getOffsetPaginatedPartialTotalRounds)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-venture-dutch-dynamic-rounds-cursor",
		Method:      http.MethodGet,
		Path:        "/venture/{id}/rounds/dynamic/dutch/cursor",
		Summary:     "Get cursor paginated rounds for a venture",
		Description: "Get all rounds for a venture.",
		Tags:        []string{"Ventures", "Dutch Dynamic Rounds"},
	}, handler.getCursorPaginatedDutchDynamicRounds)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-venture-dutch-dynamic-rounds-offset",
		Method:      http.MethodGet,
		Path:        "/venture/{id}/rounds/dynamic/dutch/offset",
		Summary:     "Get offset paginated rounds for a venture",
		Description: "Get all rounds for a venture.",
		Tags:        []string{"Ventures", "Dutch Dynamic Rounds"},
	}, handler.getOffsetPaginatedDutchDynamicRounds)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-venture-round-investments-cursor",
		Method:      http.MethodGet,
		Path:        "/venture/{id}/round-investments/cursor",
		Summary:     "Get cursor paginated round investments for a venture",
		Description: "Get all round investments for a venture.",
		Tags:        []string{"Ventures", "Round Investments"},
	}, handler.getCursorPaginatedRoundInvestments)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-venture-round-investments-offset",
		Method:      http.MethodGet,
		Path:        "/venture/{id}/round-investments/offset",
		Summary:     "Get offset paginated round investments for a venture",
		Description: "Get all round investments for a venture.",
		Tags:        []string{"Ventures", "Round Investments"},
	}, handler.getOffsetPaginatedRoundInvestments)

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
