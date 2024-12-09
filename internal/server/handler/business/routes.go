package business

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

	huma.Register(humaApi, huma.Operation{
		OperationID: "delete-business",
		Method:      http.MethodDelete,
		Path:        "/business/{id}",
		Summary:     "Delete a business",
		Description: "Delete a business.",
		Tags:        []string{"Businesses"},
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
		OperationID: "get-business-investments-by-cursor",
		Method:      http.MethodGet,
		Path:        "/business/{id}/investments",
		Summary:     "Get recieved round investments",
		Description: "Get recieved round investments.",
		Tags:        []string{"Businesses", "Investments"},
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
	}, handler.getInvestmentsByCursor)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-business-investments-by-page",
		Method:      http.MethodGet,
		Path:        "/business/{id}/investments/page",
		Summary:     "Get recieved round investments",
		Description: "Get recieved round investments.",
		Tags:        []string{"Businesses", "Investments"},
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
	}, handler.getInvestmentsByPage)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-business-rounds-by-cursor",
		Method:      http.MethodGet,
		Path:        "/business/{id}/rounds",
		Summary:     "Get rounds",
		Description: "Get rounds.",
		Tags:        []string{"Businesses", "Rounds"},
	}, handler.getRoundsByCursor)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-business-rounds-by-page",
		Method:      http.MethodGet,
		Path:        "/business/{id}/rounds/page",
		Summary:     "Get rounds",
		Description: "Get rounds.",
		Tags:        []string{"Businesses", "Rounds"},
	}, handler.getRoundsByPage)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-business-total-funding",
		Method:      http.MethodGet,
		Path:        "/business/{id}/funding",
		Summary:     "Get total funding",
		Description: "Get total funding.",
		Tags:        []string{"Businesses", "Funding"},
	}, handler.getTotalFunding)

	huma.Register(humaApi, huma.Operation{
		OperationID: "onboard-stripe-connected-account",
		Method:      http.MethodPost,
		Path:        "/business/{id}/stripe-onboard",
		Summary:     "Onboard Stripe connected account",
		Description: "Onboard Stripe connected account.",
		Tags:        []string{"Businesses"},
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
	}, handler.onboardStripeConnectedAccount)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-stripe-dashboard-url",
		Method:      http.MethodGet,
		Path:        "/business/{id}/stripe-dashboard-url",
		Summary:     "Get Stripe dashboard url",
		Description: "Get Stripe dashboard url.",
		Tags:        []string{"Businesses"},
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
	}, handler.getStripeDashboardURL)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-business-members-by-page",
		Method:      http.MethodGet,
		Path:        "/business/{id}/members/page",
		Summary:     "Get business members",
		Description: "Get business members.",
		Tags:        []string{"Businesses", "Members"},
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
	}, handler.getMembersByPage)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-business-member-roles",
		Method:      http.MethodGet,
		Path:        "/business/{id}/roles",
		Summary:     "Get business member roles",
		Description: "Get all the roles created for this business.",
		Tags:        []string{"Businesses", "Members"},
	}, handler.getAllMemberRoles)

	huma.Register(humaApi, huma.Operation{
		OperationID: "upsert-business-legal-section",
		Method:      http.MethodPut,
		Path:        "/business/{id}/sections/legal",
		Summary:     "Upsert business legal section",
		Description: "Upsert business legal section.",
		Tags:        []string{"Businesses", "Legal Section"},
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
	}, handler.upsertBusinessLegalSection)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-business-round-create-requirements",
		Method:      http.MethodGet,
		Path:        "/business/{id}/requirements/round-create",
		Summary:     "Get round create requirements",
		Description: "Get round create requirements.",
		Tags:        []string{"Businesses", "Rounds"},
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
	}, handler.getRoundCreateRequirements)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-business-stripe-account",
		Method:      http.MethodGet,
		Path:        "/business/{id}/stripe",
		Summary:     "Get business stripe account",
		Description: "Get business stripe account.",
		Tags:        []string{"Businesses"},
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
	}, handler.getStripeAccount)
}
