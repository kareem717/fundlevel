package http

import (
	"fundlevel/internal/server/handler/account"
	"fundlevel/internal/server/handler/billing"
	"fundlevel/internal/server/handler/business"
	"fundlevel/internal/server/handler/health"
	"fundlevel/internal/server/handler/industry"
	"fundlevel/internal/server/handler/investment"
	"fundlevel/internal/server/handler/round"
	"fundlevel/internal/server/handler/user"
	"fundlevel/internal/server/handler/venture"
	"net"
	"net/http"
	"slices"

	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/adapters/humachi"
	"github.com/go-chi/chi/v5"
	chiMiddleware "github.com/go-chi/chi/v5/middleware"
	"go.uber.org/zap"
	// "go.uber.org/zap"
)

func (s *Server) routes() chi.Router {
	r := chi.NewMux()

	// A good base middleware stack
	r.Use(chiMiddleware.RealIP)
	r.Use(func(h http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if ip := net.ParseIP(r.RemoteAddr); ip != nil {
				if !slices.Contains(s.allowedIPs, ip.String()) {
					http.Error(w, "Forbidden", http.StatusForbidden)
					s.logger.Info("Disallowed IP address", zap.String("RemoteAddr", r.RemoteAddr))
					return
				}
			}
			h.ServeHTTP(w, r)
		})
	})

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
	)

	business.RegisterHumaRoutes(
		s.services,
		humaApi,
		s.logger,
	)

	billing.RegisterHumaRoutes(
		s.services,
		s.logger,
		humaApi,
		s.stripeWebhookSecret,
		s.supabaseClient,
	)

	investment.RegisterHumaRoutes(
		s.services,
		humaApi,
		s.logger,
		s.supabaseClient,
	)

	industry.RegisterHumaRoutes(
		s.services,
		humaApi,
		s.logger,
	)

	return r
}
