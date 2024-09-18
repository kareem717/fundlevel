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
		offerService: service.OfferService,
		logger:       logger,
	}

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-offer-by-id",
		Method:      http.MethodGet,
		Path:        "/offer/{id}",
		Summary:     "Get offer by ID",
		Description: "Get offer by ID.",
		Tags:        []string{"Offer"},
	}, handler.getByID)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-offers-by-round-id",
		Method:      http.MethodGet,
		Path:        "/offer/round/{id}",
		Summary:     "Get offer by round ID",
		Description: "Get offer by round ID.",
		Tags:        []string{"Offer"},
	}, handler.getAllByRoundID)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-all-offers",
		Method:      http.MethodGet,
		Path:        "/offer",
		Summary:     "Get all offers",
		Description: "Get all offers.",
		Tags:        []string{"Offer"},
	}, handler.getAll)

	huma.Register(humaApi, huma.Operation{
		OperationID: "create-offer",
		Method:      http.MethodPost,
		Path:        "/offer",
		Summary:     "Create a offer",
		Description: "Create a offer.",
		Tags:        []string{"Offer"},
	}, handler.create)

	huma.Register(humaApi, huma.Operation{
		OperationID: "update-offer-status",
		Method:      http.MethodPut,
		Path:        "/offer/{id}",
		Summary:     "Update a offer status",
		Description: "Update a offer status.",
		Tags:        []string{"Offer"},
	}, handler.updateStatus)

	huma.Register(humaApi, huma.Operation{
		OperationID: "delete-offer",
		Method:      http.MethodDelete,
		Path:        "/offer/{id}",
		Summary:     "Delete a offer",
		Description: "Delete a offer.",
		Tags:        []string{"Offer"},
	}, handler.delete)

}
