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
		OperationID: "get-fixed-total-round-by-id",
		Method:      http.MethodGet,
		Path:        "/round/total/fixed/{id}",
		Summary:     "Get fixed total round by ID",
		Description: "Get fixed total round by the associated round ID.",
		Tags:        []string{"Fixed Total Rounds"},
	}, handler.getFixedTotalById)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-all-fixed-total-rounds-cursor",
		Method:      http.MethodGet,
		Path:        "/round/total/fixed/cursor",
		Summary:     "Get cursor paginated fixed total rounds",
		Description: "Get cursor paginated fixed total rounds.",
		Tags:        []string{"Fixed Total Rounds"},
	}, handler.getCursorPaginatedFixedTotalRounds)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-all-fixed-total-rounds-offset",
		Method:      http.MethodGet,
		Path:        "/round/total/fixed/offset",
		Summary:     "Get offset paginated fixed total rounds",
		Description: "Get offset paginated fixed total rounds.",
		Tags:        []string{"Fixed Total Rounds"},
	}, handler.getOffsetPaginatedFixedTotalRounds)

	huma.Register(humaApi, huma.Operation{
		OperationID: "create-fixed-total-round",
		Method:      http.MethodPost,
		Path:        "/round/total/fixed",
		Summary:     "Create a fixed total round",
		Description: "Create a fixed total round.",
		Tags:        []string{"Fixed Total Rounds"},
	}, handler.createFixedTotalRound)

	huma.Register(humaApi, huma.Operation{
		OperationID: "delete-fixed-total-round",
		Method:      http.MethodDelete,
		Path:        "/round/total/fixed/{id}",
		Summary:     "Delete a fixed total round",
		Description: "Delete a fixed total round.",
		Tags:        []string{"Fixed Total Rounds"},
	}, handler.deleteFixedTotalRound)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-regular-dynamic-round-by-id",
		Method:      http.MethodGet,
		Path:        "/round/dynamic/regular/{id}",
		Summary:     "Get regular dynamic round by ID",
		Description: "Get regular dynamic round by the associated round ID.",
		Tags:        []string{"Regular Dynamic Rounds"},
	}, handler.getRegularDynamicById)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-all-regular-dynamic-rounds-cursor",
		Method:      http.MethodGet,
		Path:        "/round/dynamic/regular/cursor",
		Summary:     "Get cursor paginated regular dynamic rounds",
		Description: "Get cursor paginated regular dynamic rounds.",
		Tags:        []string{"Regular Dynamic Rounds"},
	}, handler.getCursorPaginatedRegularDynamicRounds)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-all-fixed-total-rounds-offset",
		Method:      http.MethodGet,
		Path:        "/round/dynamic/regular/offset",
		Summary:     "Get offset paginated regular dynamic rounds",
		Description: "Get offset paginated regular dynamic rounds.",
		Tags:        []string{"Regular Dynamic Rounds"},
	}, handler.getOffsetPaginatedRegularDynamicRounds)

	huma.Register(humaApi, huma.Operation{
		OperationID: "create-regular-dynamic-round",
		Method:      http.MethodPost,
		Path:        "/round/dynamic/regular",
		Summary:     "Create a regular dynamic round",
		Description: "Create a regular dynamic round.",
		Tags:        []string{"Regular Dynamic Rounds"},
	}, handler.createRegularDynamicRound)

	huma.Register(humaApi, huma.Operation{
		OperationID: "delete-regular-dynamic-round",
		Method:      http.MethodDelete,
		Path:        "/round/dynamic/regular/{id}",
		Summary:     "Delete a regular dynamic round",
		Description: "Delete a regular dynamic round.",
		Tags:        []string{"Regular Dynamic Rounds"},
	}, handler.deleteRegularDynamicRound)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-partial-total-round-by-id",
		Method:      http.MethodGet,
		Path:        "/round/total/partial/{id}",
		Summary:     "Get partial total round by ID",
		Description: "Get partial total round by the associated round ID.",
		Tags:        []string{"Partial Total Rounds"},
	}, handler.getPartialTotalById)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-all-partial-total-rounds-cursor",
		Method:      http.MethodGet,
		Path:        "/round/total/partial/cursor",
		Summary:     "Get cursor paginated partial total rounds",
		Description: "Get cursor paginated partial total rounds.",
		Tags:        []string{"Partial Total Rounds"},
	}, handler.getCursorPaginatedPartialTotalRounds)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-all-partial-total-rounds-offset",
		Method:      http.MethodGet,
		Path:        "/round/total/partial/offset",
		Summary:     "Get offset paginated partial total rounds",
		Description: "Get offset paginated partial total rounds.",
		Tags:        []string{"Partial Total Rounds"},
	}, handler.getOffsetPaginatedPartialTotalRounds)

	huma.Register(humaApi, huma.Operation{
		OperationID: "create-partial-total-round",
		Method:      http.MethodPost,
		Path:        "/round/total/partial",
		Summary:     "Create a partial total round",
		Description: "Create a partial total round.",
		Tags:        []string{"Partial Total Rounds"},
	}, handler.createPartialTotalRound)

	huma.Register(humaApi, huma.Operation{
		OperationID: "delete-partial-total-round",
		Method:      http.MethodDelete,
		Path:        "/round/total/partial/{id}",
		Summary:     "Delete a partial total round",
		Description: "Delete a partial total round.",
		Tags:        []string{"Partial Total Rounds"},
	}, handler.deletePartialTotalRound)

}
