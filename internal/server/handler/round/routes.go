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

}
