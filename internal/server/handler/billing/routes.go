package billing

import (
	"net/http"
	"fundlevel/internal/service"

	"github.com/danielgtaylor/huma/v2"
	"github.com/supabase-community/supabase-go"
	"go.uber.org/zap"
)

func RegisterHumaRoutes(
	service *service.Service,
	logger *zap.Logger,
	humaApi huma.API,
	webhookSecret string,
	supabaseClient *supabase.Client,
) {
	handler := newHTTPHandler(service, logger, webhookSecret)

	huma.Register(humaApi, huma.Operation{
		OperationID:  "handle-stripe-webhook",
		Method:       http.MethodPost,
		Path:         "/billing/webhook",
		Summary:      "Handle a stripe webhook",
		Description:  "Handle a stripe webhook.",
		Tags:         []string{"Billing"},
		MaxBodyBytes: 64 * 1024,
	}, handler.handleStripeWebhook)

}
