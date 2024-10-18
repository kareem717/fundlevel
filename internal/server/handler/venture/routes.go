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
		OperationID: "get-ventures-by-page",
		Method:      http.MethodGet,
		Path:        "/venture/page",
		Summary:     "Get offset paginated ventures",
		Description: "Get offset paginated ventures.",
		Tags:        []string{"Ventures"},
	}, handler.getByPage)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-ventures-by-cursor",
		Method:      http.MethodGet,
		Path:        "/venture",
		Summary:     "Get cursor paginated ventures",
		Description: "Get cursor paginated ventures.",
		Tags:        []string{"Ventures"},
	}, handler.getByCursor)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-venture-rounds-by-cursor",
		Method:      http.MethodGet,
		Path:        "/venture/{id}/rounds",
		Summary:     "Get cursor paginated rounds for a venture",
		Description: "Get all rounds for a venture.",
		Tags:        []string{"Ventures", "Rounds"},
	}, handler.getRoundsByCursor)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-venture-rounds-by-page",
		Method:      http.MethodGet,
		Path:        "/venture/{id}/rounds/page",
		Summary:     "Get offset paginated rounds for a venture",
		Description: "Get all rounds for a venture.",
		Tags:        []string{"Ventures", "Rounds"},
	}, handler.getRoundsByPage)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-venture-round-investments-by-cursor",
		Method:      http.MethodGet,
		Path:        "/venture/{id}/round-investments",
		Summary:     "Get cursor paginated round investments for a venture",
		Description: "Get all round investments for a venture.",
		Tags:        []string{"Ventures", "Round Investments"},
	}, handler.getCursorPaginatedRoundInvestments)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-venture-round-investments-by-page",
		Method:      http.MethodGet,
		Path:        "/venture/{id}/round-investments/page",
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

	huma.Register(humaApi, huma.Operation{
		OperationID: "create-venture-like",
		Method:      http.MethodPost,
		Path:        "/venture/{id}/account/{accountId}/like",
		Summary:     "Create a venture like",
		Description: "Create a venture like.",
		Tags:        []string{"Ventures", "Likes"},
	}, handler.createLike)

	huma.Register(humaApi, huma.Operation{
		OperationID: "delete-venture-like",
		Method:      http.MethodDelete,
		Path:        "/venture/{id}/account/{accountId}/like",
		Summary:     "Delete a venture like",
		Description: "Delete a venture like.",
		Tags:        []string{"Ventures", "Likes"},
	}, handler.deleteLike)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-venture-like-status",
		Method:      http.MethodGet,
		Path:        "/venture/{id}/account/{accountId}/like",
		Summary:     "Get a venture like status",
		Description: "Get a venture like status.",
		Tags:        []string{"Ventures", "Likes"},
	}, handler.isLikedByAccount)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-venture-like-count",
		Method:      http.MethodGet,
		Path:        "/venture/{id}/like",
		Summary:     "Get a venture like count",
		Description: "Get a venture like count.",
		Tags:        []string{"Ventures", "Likes"},
	}, handler.getLikeCount)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-venture-active-round",
		Method:      http.MethodGet,
		Path:        "/venture/{id}/rounds/active",
		Summary:     "Get a venture active round",
		Description: "Get a venture active round.",
		Tags:        []string{"Ventures", "Rounds"},
	}, handler.getActiveRound)
}
