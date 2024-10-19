package http

import (
	"net/http"

	"github.com/supabase-community/supabase-go"
	"fundlevel/internal/service"

	"go.uber.org/zap"
)

type Server struct {
	services       *service.Service
	apiName        string
	apiVersion     string
	logger         *zap.Logger
	supabaseClient *supabase.Client
	stripeWebhookSecret string
	allowedIPs []string
}

func NewServer(
	services *service.Service,
	apiName, apiVersion string,
	logger *zap.Logger,
	supabaseClient *supabase.Client,
	stripeWebhookSecret string,
	allowedIPs []string,
) *Server {
	return &Server{
		services:       services,
		apiName:        apiName,
		apiVersion:     apiVersion,
		logger:         logger,
		supabaseClient: supabaseClient,
		stripeWebhookSecret: stripeWebhookSecret,
		allowedIPs: allowedIPs,
	}
}

func (s *Server) Serve(port string) error {
	router := s.routes()

	return http.ListenAndServe(port, router)
}
