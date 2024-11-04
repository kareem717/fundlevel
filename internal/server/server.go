package http

import (
	"net/http"

	"fundlevel/internal/service"
	"github.com/supabase-community/supabase-go"

	"go.uber.org/zap"
)

type ServerConfig struct {
	APIName                    string
	APIVersion                 string
	StripeWebhookSecret        string
	StripeConnectWebhookSecret string
	Logger                     *zap.Logger
	SupabaseClient             *supabase.Client
	Services                   *service.Service
}

type Server struct {
	services                   *service.Service
	apiName                    string
	apiVersion                 string
	logger                     *zap.Logger
	supabaseClient             *supabase.Client
	stripeWebhookSecret        string
	stripeConnectWebhookSecret string
}

func NewServer(config *ServerConfig) *Server {
	return &Server{
		services:                   config.Services,
		apiName:                    config.APIName,
		apiVersion:                 config.APIVersion,
		logger:                     config.Logger,
		supabaseClient:             config.SupabaseClient,
		stripeWebhookSecret:        config.StripeWebhookSecret,
		stripeConnectWebhookSecret: config.StripeConnectWebhookSecret,
	}
}

func (s *Server) Serve(port string) error {
	router := s.routes()

	return http.ListenAndServe(port, router)
}
