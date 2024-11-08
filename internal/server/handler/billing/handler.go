package billing

import (
	"bytes"
	"context"
	"fundlevel/internal/server/handler/shared"
	"fundlevel/internal/service"
	"io"

	"github.com/danielgtaylor/huma/v2"
	"github.com/stripe/stripe-go/v80"
	"github.com/stripe/stripe-go/v80/webhook"
	"go.uber.org/zap"
)

type httpHandler struct {
	service       *service.Service
	logger        *zap.Logger
	webhookSecret string
}

func newHTTPHandler(service *service.Service, logger *zap.Logger, webhookSecret string) *httpHandler {
	if service == nil {
		panic("service is nil")
	}

	if logger == nil {
		panic("logger is nil")
	}

	return &httpHandler{
		service:       service,
		logger:        logger,
		webhookSecret: webhookSecret,
	}
}

func (h *httpHandler) handleStripeWebhook(ctx context.Context, input *shared.HandleStripeWebhookInput) (*struct{}, error) {
	reader := bytes.NewReader(input.Body)

	payload, err := io.ReadAll(reader)
	if err != nil {
		h.logger.Error("failed to read webhook body", zap.Error(err))
		return nil, huma.Error500InternalServerError("Failed to read webhook body")
	}

	event, err := webhook.ConstructEvent(payload, input.Signature, h.webhookSecret)
	if err != nil {
		h.logger.Error("webhook signature verification failed", zap.Error(err))
		return nil, huma.Error400BadRequest("Webhook signature verification failed")
	}

	switch event.Type {
	case stripe.EventTypePaymentIntentProcessing:
		eventBody, err := shared.ParseStripeWebhook[stripe.PaymentIntent](event)
		if err != nil {
			h.logger.Error("failed to parse webhook json", zap.Error(err), zap.String("eventType", string(event.Type)))
			return nil, huma.Error500InternalServerError("Failed to parse webhook json")
		}

		err = h.service.BillingService.HandleInvestmentPaymentIntentProcessing(ctx, eventBody.ID)
		if err != nil {
			h.logger.Error("failed to handle stripe checkout success", zap.Error(err))
			return nil, huma.Error500InternalServerError("Failed to handle stripe checkout success")
		}

	case stripe.EventTypePaymentIntentPaymentFailed:
		eventBody, err := shared.ParseStripeWebhook[stripe.PaymentIntent](event)
		if err != nil {
			h.logger.Error("failed to parse webhook json", zap.Error(err), zap.String("eventType", string(event.Type)))
			return nil, huma.Error500InternalServerError("Failed to parse webhook json")
		}

		err = h.service.BillingService.HandleInvestmentPaymentIntentPaymentFailed(ctx, eventBody.ID)
		if err != nil {
			h.logger.Error("failed to handle stripe checkout success", zap.Error(err))
			return nil, huma.Error500InternalServerError("Failed to handle stripe checkout success")
		}

	case stripe.EventTypePaymentIntentSucceeded:
		eventBody, err := shared.ParseStripeWebhook[stripe.PaymentIntent](event)
		if err != nil {
			h.logger.Error("failed to parse webhook json", zap.Error(err), zap.String("eventType", string(event.Type)))
			return nil, huma.Error500InternalServerError("Failed to parse webhook json")
		}

		err = h.service.BillingService.HandleInvestmentPaymentIntentSuccess(ctx, eventBody.ID)
		if err != nil {
			h.logger.Error("failed to handle stripe checkout success", zap.Error(err))
			return nil, huma.Error500InternalServerError("Failed to handle stripe checkout success")
		}

	case stripe.EventTypePaymentIntentCanceled:
		eventBody, err := shared.ParseStripeWebhook[stripe.PaymentIntent](event)
		if err != nil {
			h.logger.Error("failed to parse webhook json", zap.Error(err), zap.String("eventType", string(event.Type)))
			return nil, huma.Error500InternalServerError("Failed to parse webhook json")
		}

		err = h.service.BillingService.HandleInvestmentPaymentIntentCancelled(ctx, eventBody.ID)
		if err != nil {
			h.logger.Error("failed to handle stripe checkout success", zap.Error(err))
			return nil, huma.Error500InternalServerError("Failed to handle stripe checkout success")
		}

	default:
		h.logger.Error("unhandled event type", zap.String("eventType", string(event.Type)))
		return nil, huma.Error501NotImplemented("Unhandled event type")
	}

	return nil, nil
}
