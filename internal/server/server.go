package http

import (
	"net/http"

	"fundlevel/internal/service"
	"github.com/supabase-community/supabase-go"

	"go.uber.org/zap"
)

type Server struct {
	services                   *service.Service
	apiName                    string
	apiVersion                 string
	logger                     *zap.Logger
	supabaseClient             *supabase.Client
	stripeWebhookSecret        string
	stripeConnectWebhookSecret string
	allowedIPs                 []string
}

func NewServer(
	services *service.Service,
	apiName, apiVersion string,
	logger *zap.Logger,
	supabaseClient *supabase.Client,
	stripeWebhookSecret string,
	stripeConnectWebhookSecret string,
	allowedIPs []string,
) *Server {
	return &Server{
		services:                   services,
		apiName:                    apiName,
		apiVersion:                 apiVersion,
		logger:                     logger,
		supabaseClient:             supabaseClient,
		stripeWebhookSecret:        stripeWebhookSecret,
		stripeConnectWebhookSecret: stripeConnectWebhookSecret,
		allowedIPs:                 allowedIPs,
	}
}

func (s *Server) Serve(port string) error {
	router := s.routes()

	return http.ListenAndServe(port, router)
}
