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
		OperationID: "accept-investment",
		Method:      http.MethodPut,
		Path:        "/investment/{id}/accept",
		Summary:     "Accept an investment",
		Description: "Accept an investment.",
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
	}, handler.acceptInvestment)

	huma.Register(humaApi, huma.Operation{
		OperationID: "withdraw-investment",
		Method:      http.MethodPost,
		Path:        "/investment/{id}/withdraw",
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
		Path:        "/investment",
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
		Path:        "/investment/{id}",
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

}
