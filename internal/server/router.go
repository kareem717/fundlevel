package http

import (
	"fundlevel/internal/server/handler/account"
	"fundlevel/internal/server/handler/health"
	"fundlevel/internal/server/handler/offer"
	"fundlevel/internal/server/handler/round"
	"fundlevel/internal/server/handler/user"
	"fundlevel/internal/server/handler/venture"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/adapters/humachi"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

func (s *Server) routes() chi.Router {
	r := chi.NewMux()

	// Basic CORS
	// for more ideas, see: https://developer.github.com/v3/#cross-origin-resource-sharing
	r.Use(cors.Handler(cors.Options{
		// AllowedOrigins:   []string{"https://venture.com"}, // Use this to allow specific origin hosts
		// AllowedOrigins:   []string{"*"},
		AllowOriginFunc:    func(r *http.Request, origin string) bool { return true },
		AllowedMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:     []string{"*"},
		ExposedHeaders:     []string{"Link"},
		OptionsPassthrough: false,
		AllowCredentials:   true,
		MaxAge:             300, // Maximum value not ignored by any of major browsers
	}))

	// Handle OPTIONS requests
	r.Options("/*", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
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

	offer.RegisterHumaRoutes(
		s.services,
		humaApi,
		s.logger,
	)

	return r
}
