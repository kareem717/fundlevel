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
		Path:        "/analytic/rounds/{id}/impressions",
		Summary:     "Get a round impression count",
		Description: "Get a round impression count.",
		Tags:        []string{"Analytic", "Rounds"},
	}, handler.getRoundImpressionCount)

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
		Path:        "/analytic/businesses/{id}/impressions",
		Summary:     "Get a business impression count",
		Description: "Get a business impression count.",
		Tags:        []string{"Analytic", "Businesses"},
	}, handler.getBusinessImpressionCount)

	huma.Register(humaApi, huma.Operation{
		OperationID: "create-round-favourite",
		Method:      http.MethodPost,
		Path:        "/analytic/rounds/{id}/account/{accountId}/favourite",
		Summary:     "Create a round favourite",
		Description: "Create a round favourite.",
		Tags:        []string{"Analytic", "Rounds", "Favourites"},
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
	}, handler.createRoundFavourite)

	huma.Register(humaApi, huma.Operation{
		OperationID: "delete-round-favourite",
		Method:      http.MethodDelete,
		Path:        "/analytic/rounds/{id}/account/{accountId}/favourite",
		Summary:     "Delete a round favourite",
		Description: "Delete a round favourite.",
		Tags:        []string{"Analytic", "Rounds", "Favourites"},
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
	}, handler.deleteRoundFavourite)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-round-favourite-status",
		Method:      http.MethodGet,
		Path:        "/analytic/rounds/{id}/account/{accountId}/favourite",
		Summary:     "Get a round favourite status",
		Description: "Get a round favourite status.",
		Tags:        []string{"Analytic", "Rounds", "Favourites"},
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
	}, handler.isRoundFavouritedByAccount)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-round-favourite-count",
		Method:      http.MethodGet,
		Path:        "/analytic/rounds/{id}/favourites",
		Summary:     "Get a round favourite count",
		Description: "Get a round favourite count.",
		Tags:        []string{"Analytic", "Rounds", "Favourites"},
	}, handler.getRoundFavouriteCount)

	huma.Register(humaApi, huma.Operation{
		OperationID: "create-venture-favourite",
		Method:      http.MethodPost,
		Path:        "/analytic/ventures/{id}/account/{accountId}/favourite",
		Summary:     "Create a venture favourite",
		Description: "Create a venture favourite.",
		Tags:        []string{"Analytic", "Ventures", "Favourites"},
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
	}, handler.createVentureFavourite)

	huma.Register(humaApi, huma.Operation{
		OperationID: "delete-venture-favourite",
		Method:      http.MethodDelete,
		Path:        "/analytic/ventures/{id}/account/{accountId}/favourite",
		Summary:     "Delete a venture favourite",
		Description: "Delete a venture favourite.",
		Tags:        []string{"Analytic", "Ventures", "Favourites"},
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
	}, handler.deleteVentureFavourite)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-venture-favourite-status",
		Method:      http.MethodGet,
		Path:        "/analytic/ventures/{id}/account/{accountId}/favourite",
		Summary:     "Get a venture favourite status",
		Description: "Get a venture favourite status.",
		Tags:        []string{"Analytic", "Ventures", "Favourites"},
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
	}, handler.isVentureFavouritedByAccount)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-venture-favourite-count",
		Method:      http.MethodGet,
		Path:        "/analytic/ventures/{id}/favourites",
		Summary:     "Get a venture favourite count",
		Description: "Get a venture favourite count.",
		Tags:        []string{"Analytic", "Ventures", "Favourites"},
	}, handler.getVentureFavouriteCount)

	huma.Register(humaApi, huma.Operation{
		OperationID: "create-business-favourite",
		Method:      http.MethodPost,
		Path:        "/analytic/businesses/{id}/account/{accountId}/favourite",
		Summary:     "Create a business favourite",
		Description: "Create a business favourite.",
		Tags:        []string{"Analytic", "Businesses", "Favourites"},
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
	}, handler.createBusinessFavourite)

	huma.Register(humaApi, huma.Operation{
		OperationID: "delete-business-favourite",
		Method:      http.MethodDelete,
		Path:        "/analytic/businesses/{id}/account/{accountId}/favourite",
		Summary:     "Delete a business favourite",
		Description: "Delete a business favourite.",
		Tags:        []string{"Analytic", "Businesses", "Favourites"},
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
	}, handler.deleteBusinessFavourite)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-business-favourite-status",
		Method:      http.MethodGet,
		Path:        "/analytic/businesses/{id}/account/{accountId}/favourite",
		Summary:     "Get a business favourite status",
		Description: "Get a business favourite status.",
		Tags:        []string{"Analytic", "Businesses", "Favourites"},
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
	}, handler.isBusinessFavouritedByAccount)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-business-favourite-count",
		Method:      http.MethodGet,
		Path:        "/analytic/businesses/{id}/favourites",
		Summary:     "Get a business favourite count",
		Description: "Get a business favourite count.",
		Tags:        []string{"Analytic", "Businesses", "Favourites"},
	}, handler.getBusinessFavouriteCount)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-daily-aggregated-round-analytics",
		Method:      http.MethodGet,
		Path:        "/analytic/rounds/{id}",
		Summary:     "Get daily aggregated round analytics",
		Description: "Get daily aggregated round analytics.",
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
	}, handler.getDailyAggregatedRoundAnalytics)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-daily-aggregated-venture-analytics",
		Method:      http.MethodGet,
		Path:        "/analytic/ventures/{id}",
		Summary:     "Get daily aggregated venture analytics",
		Description: "Get daily aggregated venture analytics.",
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
	}, handler.getDailyAggregatedVentureAnalytics)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-daily-aggregated-business-analytics",
		Method:      http.MethodGet,
		Path:        "/analytic/businesses/{id}",
		Summary:     "Get daily aggregated business analytics",
		Description: "Get daily aggregated business analytics.",
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
	}, handler.getDailyAggregatedBusinessAnalytics)
}
