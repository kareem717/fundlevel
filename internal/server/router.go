package http

import (
	"fundlevel/internal/server/handler/account"
	"fundlevel/internal/server/handler/analytic"
	"fundlevel/internal/server/handler/billing"
	"fundlevel/internal/server/handler/business"
	"fundlevel/internal/server/handler/health"
	"fundlevel/internal/server/handler/industry"
	"fundlevel/internal/server/handler/investment"
	"fundlevel/internal/server/handler/round"
	"fundlevel/internal/server/handler/user"
	"fundlevel/internal/server/handler/venture"

	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/adapters/humachi"
	"github.com/go-chi/chi/v5"
)

func (s *Server) routes() chi.Router {
	r := chi.NewMux()

	config := huma.DefaultConfig(s.apiName, s.apiVersion)
	config.Components.SecuritySchemes = map[string]*huma.SecurityScheme{
		"bearerAuth": {
			Type:         "http",
			Scheme:       "bearer",
			BearerFormat: "JWT",
		},
	}

	humaApi := humachi.New(r, config)

	venture.RegisterHumaRoutes(
		s.services,
		humaApi,
		s.logger,
		s.supabaseClient,
	)

	account.RegisterHumaRoutes(
		s.services,
		humaApi,
		s.logger,
		s.supabaseClient,
	)

	user.RegisterHumaRoutes(
		s.services,
		humaApi,
		s.logger,
		s.supabaseClient,
	)

	health.RegisterHumaRoutes(
		s.services,
		humaApi,
		s.logger,
	)

	round.RegisterHumaRoutes(
		s.services,
		humaApi,
		s.logger,
		s.supabaseClient,
	)

	business.RegisterHumaRoutes(
		s.services,
		humaApi,
		s.logger,
		s.supabaseClient,
		s.stripeConnectWebhookSecret,
	)

	billing.RegisterHumaRoutes(
		s.services,
		s.logger,
		humaApi,
		s.stripeWebhookSecret,
		s.supabaseClient,
	)

	industry.RegisterHumaRoutes(
		s.services,
		humaApi,
		s.logger,
	)

	investment.RegisterHumaRoutes(
		s.services,
		humaApi,
		s.logger,
		s.supabaseClient,
	)

	analytic.RegisterHumaRoutes(
		s.services,
		s.logger,
		humaApi,
		s.supabaseClient,
	)

	return r
}
