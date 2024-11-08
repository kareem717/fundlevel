package investment

import (
	"net/http"

	"fundlevel/internal/server/middleware"
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
	handler := newHTTPHandler(service, logger)

	huma.Register(humaApi, huma.Operation{
		OperationID: "process-investment",
		Method:      http.MethodPut,
		Path:        "/investments/{id}/process",
		Summary:     "Process an investment",
		Description: "Process an investment.",
		Tags:        []string{"Investments"},
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
	}, handler.processInvestment)

	huma.Register(humaApi, huma.Operation{
		OperationID: "withdraw-investment",
		Method:      http.MethodPost,
		Path:        "/investments/{id}/withdraw",
		Summary:     "Withdraw a investment",
		Description: "Withdraw a investment.",
		Tags:        []string{"Investments"},
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
	}, handler.withdrawInvestment)

	huma.Register(humaApi, huma.Operation{
		OperationID: "create-round-investment",
		Method:      http.MethodPost,
		Path:        "/investments",
		Summary:     "Create a round investment",
		Description: "Create a round investment.",
		Tags:        []string{"Investments"},
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
	}, handler.createInvestment)

	huma.Register(humaApi, huma.Operation{
		OperationID: "delete-round-investment",
		Method:      http.MethodDelete,
		Path:        "/investments/{id}",
		Summary:     "Delete a round investment",
		Description: "Delete a round investment.",
		Tags:        []string{"Investments"},
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
	}, handler.deleteInvestment)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-investment-payment-intent-client-secret",
		Method:      http.MethodGet,
		Path:        "/investments/{id}/payment-intent",
		Summary:     "Get a stripe payment intent client secret",
		Description: "Get a stripe payment intent client secret.",
		Tags:        []string{"Investments"},
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
	}, handler.getInvestmentPaymentIntentClientSecret)
}
