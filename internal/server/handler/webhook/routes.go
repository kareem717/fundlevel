package webhook

import (
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
	stripeWebhookSecret string,
	stripeConnectWebhookSecret string,

	supabaseClient *supabase.Client,
) {
	handler := newHTTPHandler(service, logger, stripeWebhookSecret, stripeConnectWebhookSecret)

	huma.Register(humaApi, huma.Operation{
		OperationID:  "handle-stripe-webhook",
		Method:       http.MethodPost,
		Path:         "/webhook/stripe",
		Summary:      "Handle a stripe webhook",
		Description:  "Handle a stripe webhook.",
		Tags:         []string{"Webhook"},
		MaxBodyBytes: 64 * 1024,
	}, handler.handleStripeWebhook)
	
	huma.Register(humaApi, huma.Operation{
		OperationID:  "handle-stripe-connect-webhook",
		Method:       http.MethodPost,
		Path:         "/webhook/stripe-connect",
		Summary:      "Handle a stripe connect webhook",
		Description:  "Handle a stripe connect webhook.",
		Tags:         []string{"Webhook"},
		MaxBodyBytes: 64 * 1024,
	}, handler.handleStripeConnectWebhook)
}
