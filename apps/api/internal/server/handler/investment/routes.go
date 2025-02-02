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
		OperationID: "upsert-round-investment",
		Method:      http.MethodPut,
		Path:        "/investments",
		Summary:     "Upsert a round investment",
		Description: "Create a round investment. If a incomplete investment exists, it will be updated with the new values and used for the new investment.",
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
	}, handler.upsert)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-investment-by-id",
		Method:      http.MethodGet,
		Path:        "/investments/{id}",
		Summary:     "Get a round investment",
		Description: "Get a round investment.",
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
	}, handler.getInvestmentById)

	huma.Register(humaApi, huma.Operation{
		OperationID: "confirm-investment-payment",
		Method:      http.MethodPost,
		Path:        "/investments/{id}/confirm-payment",
		Summary:     "Confirm a stripe payment intent",
		Description: "Confirm a stripe payment intent for an investment.",
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
	}, handler.confirmPaymentIntent)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-investment-active-payment",
		Method:      http.MethodGet,
		Path:        "/investments/{id}/pay",
		Summary:     "Get the active payment for an investment",
		Description: "Get the payment for the current investment that is either processing or succeeded.",
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
	}, handler.getInvestmentActivePayment)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-investment-payments",
		Method:      http.MethodGet,
		Path:        "/investments/{id}/payments",
		Summary:     "Get a round investment payments",
		Description: "Get a round investment payments.",
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
	}, handler.getInvestmentPayments)

	huma.Register(humaApi, huma.Operation{
		OperationID: "update-investment",
		Method:      http.MethodPut,
		Path:        "/investments/{id}",
		Summary:     "Update a round investment",
		Description: "Update a round investment.",
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
	}, handler.update)
}
