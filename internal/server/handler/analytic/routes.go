package analytic

import (
	"fundlevel/internal/server/middleware"
	"fundlevel/internal/service"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"github.com/supabase-community/supabase-go"
	"go.uber.org/zap"
)

func RegisterHumaRoutes(
	service *service.Service,
	logger *zap.Logger,
	humaApi huma.API,
	supabaseClient *supabase.Client,
) {
	handler := newHTTPHandler(service, logger)

	huma.Register(humaApi, huma.Operation{
		OperationID: "create-round-impression",
		Method:      http.MethodPost,
		Path:        "/analytic/rounds/{id}/impressions",
		Summary:     "Create a round impression",
		Description: "Create a round impression.",
		Tags:        []string{"Analytic", "Rounds"},
		Security: []map[string][]string{
			{"bearerAuth": {}},
		},
		Middlewares: huma.Middlewares{
			func(ctx huma.Context, next func(huma.Context)) {
				middleware.WithUser(humaApi)(ctx, next, logger, supabaseClient)
			},
			func(ctx huma.Context, next func(huma.Context)) {
				middleware.WithAccount(humaApi)(ctx, next, logger, service)
			},
		},
	}, handler.createRoundImpression)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-round-impression-count",
		Method:      http.MethodGet,
		Path:        "/analytic/rounds/{id}/impressions/count",
		Summary:     "Get a round impression count",
		Description: "Get a round impression count.",
		Tags:        []string{"Analytic", "Rounds"},
	}, handler.getRoundImpressionCount)

	huma.Register(humaApi, huma.Operation{
		OperationID: "create-venture-impression",
		Method:      http.MethodPost,
		Path:        "/analytic/ventures/{id}/impressions",
		Summary:     "Create a venture impression",
		Description: "Create a venture impression.",
		Tags:        []string{"Analytic", "Ventures"},
		Security: []map[string][]string{
			{"bearerAuth": {}},
		},
		Middlewares: huma.Middlewares{
			func(ctx huma.Context, next func(huma.Context)) {
				middleware.WithUser(humaApi)(ctx, next, logger, supabaseClient)
			},
			func(ctx huma.Context, next func(huma.Context)) {
				middleware.WithAccount(humaApi)(ctx, next, logger, service)
			},
		},
	}, handler.createVentureImpression)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-venture-impression-count",
		Method:      http.MethodGet,
		Path:        "/analytic/ventures/{id}/impressions/count",
		Summary:     "Get a venture impression count",
		Description: "Get a venture impression count.",
		Tags:        []string{"Analytic", "Ventures"},
	}, handler.getVentureImpressionCount)

	huma.Register(humaApi, huma.Operation{
		OperationID: "create-business-impression",
		Method:      http.MethodPost,
		Path:        "/analytic/businesses/{id}/impressions",
		Summary:     "Create a business impression",
		Description: "Create a business impression.",
		Tags:        []string{"Analytic", "Businesses"},
		Security: []map[string][]string{
			{"bearerAuth": {}},
		},
		Middlewares: huma.Middlewares{
			func(ctx huma.Context, next func(huma.Context)) {
				middleware.WithUser(humaApi)(ctx, next, logger, supabaseClient)
			},
			func(ctx huma.Context, next func(huma.Context)) {
				middleware.WithAccount(humaApi)(ctx, next, logger, service)
			},
		},
	}, handler.createBusinessImpression)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-business-impression-count",
		Method:      http.MethodGet,
		Path:        "/analytic/businesses/{id}/impressions/count",
		Summary:     "Get a business impression count",
		Description: "Get a business impression count.",
		Tags:        []string{"Analytic", "Businesses"},
	}, handler.getBusinessImpressionCount)
}
