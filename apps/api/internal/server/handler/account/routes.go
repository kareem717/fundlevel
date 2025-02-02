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

	handler := newHTTPHandler(service, logger)

	huma.Register(humaApi, huma.Operation{
		OperationID:   "create-account",
		Method:        http.MethodPost,
		Path:          "/account",
		Summary:       "Create a account",
		Description:   "Create a account.",
		Tags:          []string{"Accounts"},
		DefaultStatus: http.StatusCreated,
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
		OperationID: "getAccount",
		Method:      http.MethodGet,
		Path:        "/account",
		Summary:     "Get account by user id",
		Description: "Fetches the account for the currently authenticated user.",
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
	}, handler.getByUserId)

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
		OperationID: "get-account-businesses",
		Method:      http.MethodGet,
		Path:        "/account/{id}/businesses",
		Summary:     "Get businesses",
		Description: "Get businesses.",
		Tags:        []string{"Accounts", "Businesses"},
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
	}, handler.getAllBusinesses)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-stripe-identity-verification-session-url",
		Method:      http.MethodPost,
		Path:        "/account/stripe-identity",
		Summary:     "Get stripe identity verification session url",
		Description: "Get stripe identity verification session url for the currently authenticated account.",
		Tags:        []string{"Accounts", "Stripe"},
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
	}, handler.getStripeIdentityVerificationSessionURL)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-stripe-identity",
		Method:      http.MethodGet,
		Path:        "/account/stripe-identity",
		Summary:     "Get stripe identity",
		Description: "Get stripe identity for the currently authenticated account.",
		Tags:        []string{"Accounts", "Stripe"},
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
	}, handler.getStripeIdentity)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-account-investments",
		Method:      http.MethodGet,
		Path:        "/account/investments",
		Summary:     "Get investments",
		Description: "Get investments for the currently authenticated account.",
		Tags:        []string{"Accounts", "Investments"},
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
	}, handler.getInvestments)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-account-active-round-investment",
		Method:      http.MethodGet,
		Path:        "/account/investments/round/{id}",
		Summary:     "Get active round investment",
		Description: "Get active round investment for the currently authenticated account.",
		Tags:        []string{"Accounts", "Investments"},
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
	}, handler.getActiveRoundInvestment)
}
