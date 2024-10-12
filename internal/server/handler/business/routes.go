package business

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
		OperationID: "get-business-by-id",
		Method:      http.MethodGet,
		Path:        "/business/{id}",
		Summary:     "Get business by ID",
		Description: "Get business by ID.",
		Tags:        []string{"Businesses"},
	}, handler.getByID)

	huma.Register(humaApi, huma.Operation{
		OperationID: "create-business",
		Method:      http.MethodPost,
		Path:        "/business",
		Summary:     "Create a business",
		Description: "Create a business.",
		Tags:        []string{"Businesses"},
	}, handler.create)

	huma.Register(humaApi, huma.Operation{
		OperationID: "delete-business",
		Method:      http.MethodDelete,
		Path:        "/business/{id}",
		Summary:     "Delete a business",
		Description: "Delete a business.",
		Tags:        []string{"Businesses"},
	}, handler.delete)

	huma.Register(humaApi, huma.Operation{
		OperationID: "create-business-member",
		Method:      http.MethodPost,
		Path:        "/business/{id}/members",
		Summary:     "Create a business member",
		Description: "Create a business member.",
		Tags:        []string{"Businesses", "Members"},
	}, handler.createMember)

	huma.Register(humaApi, huma.Operation{
		OperationID: "delete-business-member",
		Method:      http.MethodDelete,
		Path:        "/business/{businessId}/members/{id}",
		Summary:     "Delete a business member",
		Description: "Delete a business member.",
		Tags:        []string{"Businesses", "Members"},
	}, handler.deleteMember)

	huma.Register(humaApi, huma.Operation{
		OperationID: "update-business-member",
		Method:      http.MethodPut,
		Path:        "/business/{businessId}/members/{id}",
		Summary:     "Update a business member",
		Description: "Update a business member.",
		Tags:        []string{"Businesses", "Members"},
	}, handler.updateMember)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-business-members",
		Method:      http.MethodGet,
		Path:        "/business/{id}/members",
		Summary:     "Get business members",
		Description: "Get business members.",
		Tags:        []string{"Businesses", "Members"},
	}, handler.getMembersByPage)
}
