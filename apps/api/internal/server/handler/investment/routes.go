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

	// huma.Register(humaApi, huma.Operation{
	// 	OperationID: "process-investment",
	// 	Method:      http.MethodPut,
	// 	Path:        "/investments/{id}/process",
	// 	Summary:     "Process an investment",
	// 	Description: "Process an investment.",
	// 	Tags:        []string{"Investments"},
	// 	Security: []map[string][]string{
	// 		{"bearerAuth": {}},
	// 	},
	// 	Middlewares: huma.Middlewares{
	// 		func(ctx huma.Context, next func(huma.Context)) {
	// 			middleware.WithUser(humaApi)(ctx, next, logger, supabaseClient)
	// 		},
	// 		func(ctx huma.Context, next func(huma.Context)) {
	// 			middleware.WithAccount(humaApi)(ctx, next, logger, service)
	// 		},
	// 	},
	// }, handler.processInvestment)

	// huma.Register(humaApi, huma.Operation{
	// 	OperationID: "withdraw-investment",
	// 	Method:      http.MethodPost,
	// 	Path:        "/investments/{id}/withdraw",
	// 	Summary:     "Withdraw a investment",
	// 	Description: "Withdraw a investment.",
	// 	Tags:        []string{"Investments"},
	// 	Security: []map[string][]string{
	// 		{"bearerAuth": {}},
	// 	},
	// 	Middlewares: huma.Middlewares{
	// 		func(ctx huma.Context, next func(huma.Context)) {
	// 			middleware.WithUser(humaApi)(ctx, next, logger, supabaseClient)
	// 		},
	// 		func(ctx huma.Context, next func(huma.Context)) {
	// 			middleware.WithAccount(humaApi)(ctx, next, logger, service)
	// 		},
	// 	},
	// }, handler.withdrawInvestment)

	huma.Register(humaApi, huma.Operation{
		OperationID: "create-round-investment",
		Method:      http.MethodPost,
		Path:        "/investments/round/{id}",
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
	}, handler.create)

	// huma.Register(humaApi, huma.Operation{
	// 	OperationID: "delete-round-investment",
	// 	Method:      http.MethodDelete,
	// 	Path:        "/investments/{id}",
	// 	Summary:     "Delete a round investment",
	// 	Description: "Delete a round investment.",
	// 	Tags:        []string{"Investments"},
	// 	Security: []map[string][]string{
	// 		{"bearerAuth": {}},
	// 	},
	// 	Middlewares: huma.Middlewares{
	// 		func(ctx huma.Context, next func(huma.Context)) {
	// 			middleware.WithUser(humaApi)(ctx, next, logger, supabaseClient)
	// 		},
	// 		func(ctx huma.Context, next func(huma.Context)) {
	// 			middleware.WithAccount(humaApi)(ctx, next, logger, service)
	// 		},
	// 	},
	// }, handler.deleteInvestment)

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
		OperationID: "create-investment-payment-intent",
		Method:      http.MethodPost,
		Path:        "/investments/{id}/pay",
		Summary:     "Create a stripe payment intent",
		Description: "Create a stripe payment intent for an investment.",
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
	}, handler.createStripePaymentIntent)

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
}
