package account

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

	handler := &httpHandler{
		service: service,
		logger:  logger,
	}

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-account-by-id",
		Method:      http.MethodGet,
		Path:        "/account/{id}",
		Summary:     "Get account by ID",
		Description: "Get account by ID.",
		Tags:        []string{"Accounts"},
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
	}, handler.getByID)

	huma.Register(humaApi, huma.Operation{
		OperationID: "create-account",
		Method:      http.MethodPost,
		Path:        "/account",
		Summary:     "Create a account",
		Description: "Create a account.",
		Tags:        []string{"Accounts"},
		Security: []map[string][]string{
			{"bearerAuth": {}},
		},
		Middlewares: huma.Middlewares{
			func(ctx huma.Context, next func(huma.Context)) {
				middleware.WithUser(humaApi)(ctx, next, logger, supabaseClient)
			},
		},
	}, handler.create)

	huma.Register(humaApi, huma.Operation{
		OperationID: "update-account",
		Method:      http.MethodPut,
		Path:        "/account/{id}",
		Summary:     "Update a account",
		Description: "Update a account.",
		Tags:        []string{"Accounts"},
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

	huma.Register(humaApi, huma.Operation{
		OperationID: "delete-account",
		Method:      http.MethodDelete,
		Path:        "/account/{id}",
		Summary:     "Delete a account",
		Description: "Delete a account.",
		Tags:        []string{"Accounts"},
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
	}, handler.delete)

	huma.Register(humaApi, huma.Operation{
		OperationID: "create-round-investment",
		Method:      http.MethodPost,
		Path:        "/account/{id}/round-investments",
		Summary:     "Create a round investment",
		Description: "Create a round investment.",
		Tags:        []string{"Accounts", "Investments"},
	}, handler.createRoundInvestment)

	huma.Register(humaApi, huma.Operation{
		OperationID: "delete-round-investment",
		Method:      http.MethodDelete,
		Path:        "/account/{id}/round-investments/{investmentId}",
		Summary:     "Delete a round investment",
		Description: "Delete a round investment.",
		Tags:        []string{"Accounts", "Investments"},
	}, handler.deleteRoundInvestment)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-account-round-investments-cursor",
		Method:      http.MethodGet,
		Path:        "/account/{id}/round-investments/cursor",
		Summary:     "Get round investments",
		Description: "Get round investments.",
		Tags:        []string{"Accounts", "Investments"},
	}, handler.getCursorPaginatedRoundInvestments)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-round-investments-offset",
		Method:      http.MethodGet,
		Path:        "/account/{id}/round-investments/offset",
		Summary:     "Get round investments",
		Description: "Get round investments.",
		Tags:        []string{"Accounts", "Investments"},
	}, handler.getOffsetPaginatedRoundInvestments)

	huma.Register(humaApi, huma.Operation{
		OperationID: "withdraw-round-investment",
		Method:      http.MethodPost,
		Path:        "/account/{id}/round-investments/{investmentId}/withdraw",
		Summary:     "Withdraw a round investment",
		Description: "Withdraw a round investment.",
		Tags:        []string{"Accounts", "Investments"},
	}, handler.withdrawRoundInvestment)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-account-businesses",
		Method:      http.MethodGet,
		Path:        "/account/{id}/businesses",
		Summary:     "Get businesses",
		Description: "Get businesses.",
		Tags:        []string{"Accounts", "Businesses"},
	}, handler.getBusinesses)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-account-checkout-link",
		Method:      http.MethodGet,
		Path:        "/account/{id}/round-investments/{investmentId}/checkout",
		Summary:     "Get a stripe checkout link",
		Description: "Get a stripe checkout link.",
		Tags:        []string{"Accounts", "Investments"},
	}, handler.investmentCheckoutLink)

}
