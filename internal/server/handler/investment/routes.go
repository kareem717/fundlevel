package investment

import (
	"net/http"

	"fundlevel/internal/service"
	"github.com/danielgtaylor/huma/v2"
	"github.com/supabase-community/supabase-go"
	"go.uber.org/zap"
)

func RegisterHumaRoutes(
	service *service.Service,
	humaApi huma.API,
	logger *zap.Logger,
	supabaseClient *supabase.Client,
) {

	handler := &httpHandler{
		service: service,
		logger:  logger,
	}

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-investment-by-id",
		Method:      http.MethodGet,
		Path:        "/investment/{id}",
		Summary:     "Get investment by ID",
		Description: "Get investment by ID.",
		Tags:        []string{"Investments"},
	}, handler.getByID)
}
