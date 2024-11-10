package webhook

import (
	"bytes"
	"context"
	"database/sql"
	"errors"
	"fundlevel/internal/entities/business"
	"fundlevel/internal/server/handler/shared"
	"fundlevel/internal/service"
	"io"

	"github.com/danielgtaylor/huma/v2"
	"github.com/stripe/stripe-go/v80"
	"github.com/stripe/stripe-go/v80/webhook"
	"go.uber.org/zap"
)

type httpHandler struct {
	service                    *service.Service
	logger                     *zap.Logger
	stripeWebhookSecret        string
	stripeConnectWebhookSecret string
}

func newHTTPHandler(service *service.Service, logger *zap.Logger, stripeWebhookSecret string, stripeConnectWebhookSecret string) *httpHandler {
	if service == nil {
		panic("service is nil")
	}

	if logger == nil {
		panic("logger is nil")
	}

	return &httpHandler{
		service:                    service,
		logger:                     logger,
		stripeWebhookSecret:        stripeWebhookSecret,
		stripeConnectWebhookSecret: stripeConnectWebhookSecret,
	}
}

func (h *httpHandler) handleStripeWebhook(ctx context.Context, input *shared.HandleStripeWebhookInput) (*struct{}, error) {
	reader := bytes.NewReader(input.Body)

	payload, err := io.ReadAll(reader)
	if err != nil {
		h.logger.Error("failed to read webhook body", zap.Error(err))
		return nil, huma.Error500InternalServerError("Failed to read webhook body")
	}

	event, err := webhook.ConstructEvent(payload, input.Signature, h.stripeWebhookSecret)
	if err != nil {
		h.logger.Error("webhook signature verification failed", zap.Error(err))
		return nil, huma.Error400BadRequest("Webhook signature verification failed")
	}

	switch event.Type {
	// case stripe.EventTypePaymentIntentProcessing:
	// 	eventBody, err := shared.ParseStripeWebhook[stripe.PaymentIntent](event)
	// 	if err != nil {
	// 		h.logger.Error("failed to parse webhook json", zap.Error(err), zap.String("eventType", string(event.Type)))
	// 		return nil, huma.Error500InternalServerError("Failed to parse webhook json")
	// 	}

	// 	err = h.service.InvestmentService.HandleInvestmentPaymentIntentProcessing(ctx, eventBody.ID)
	// 	if err != nil {
	// 		h.logger.Error("failed to handle stripe checkout success", zap.Error(err))
	// 		return nil, huma.Error500InternalServerError("Failed to handle stripe checkout success")
	// 	}
	case stripe.EventTypeAccountUpdated:
		eventBody, err := shared.ParseStripeWebhook[stripe.Account](event)
		if err != nil {
			h.logger.Error("failed to parse webhook json", zap.Error(err), zap.String("eventType", string(event.Type)))
			return nil, huma.Error500InternalServerError("Failed to parse webhook json")
		}

		stripeConnectedAccountId := eventBody.ID

		businessRecord, err := h.service.BusinessService.GetByStripeConnectedAccountId(ctx, stripeConnectedAccountId)
		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				h.logger.Error("business not found", zap.String("stripeConnectedAccountId", stripeConnectedAccountId))
				return nil, huma.Error404NotFound("Business not found")
			}

			h.logger.Error("failed to fetch business", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the business")
		}

		if eventBody.Requirements.DisabledReason != "" {
			h.logger.Error("business is disabled", zap.String("stripeConnectedAccountId", stripeConnectedAccountId), zap.String("disabledReason", string(eventBody.Requirements.DisabledReason)))

			if businessRecord.StripeAccountEnabled {
				_, err = h.service.BusinessService.Update(ctx, businessRecord.ID, business.UpdateBusinessParams{
					StripeAccountEnabled: false,
				})

				if err != nil {
					h.logger.Error("failed to update business", zap.Error(err))
					return nil, huma.Error500InternalServerError("An error occurred while changing the business's stripe account enabled status")
				}
			}

			return nil, huma.Error400BadRequest("Business is disabled")
		}

		if len(eventBody.Requirements.CurrentlyDue) > 0 {
			h.logger.Error("business requires additional information", zap.String("stripeConnectedAccountId", stripeConnectedAccountId))
			return nil, huma.Error400BadRequest("Business requires additional information")
		}
		_, err = h.service.BusinessService.Update(ctx, businessRecord.ID, business.UpdateBusinessParams{
			StripeAccountEnabled: true,
		})

		if err != nil {
			h.logger.Error("failed to update business", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while changing the business's stripe account enabled status")
		}

	// case stripe.EventTypePaymentIntentPaymentFailed:
	// 	eventBody, err := shared.ParseStripeWebhook[stripe.PaymentIntent](event)
	// 	if err != nil {
	// 		h.logger.Error("failed to parse webhook json", zap.Error(err), zap.String("eventType", string(event.Type)))
	// 		return nil, huma.Error500InternalServerError("Failed to parse webhook json")
	// 	}

	// 	err = h.service.BillingService.HandleInvestmentPaymentIntentPaymentFailed(ctx, eventBody.ID)
	// 	if err != nil {
	// 		h.logger.Error("failed to handle stripe checkout success", zap.Error(err))
	// 		return nil, huma.Error500InternalServerError("Failed to handle stripe checkout success")
	// 	}

	case stripe.EventTypePaymentIntentSucceeded:
		eventBody, err := shared.ParseStripeWebhook[stripe.PaymentIntent](event)
		if err != nil {
			h.logger.Error("failed to parse webhook json", zap.Error(err), zap.String("eventType", string(event.Type)))
			return nil, huma.Error500InternalServerError("Failed to parse webhook json")
		}

		err = h.service.InvestmentService.HandleInvestmentPaymentIntentSuccess(ctx, eventBody.ID)
		if err != nil {
			h.logger.Error("failed to handle stripe checkout success", zap.Error(err))
			return nil, huma.Error500InternalServerError("Failed to handle stripe checkout success")
		}

	// case stripe.EventTypePaymentIntentCanceled:
	// 	eventBody, err := shared.ParseStripeWebhook[stripe.PaymentIntent](event)
	// 	if err != nil {
	// 		h.logger.Error("failed to parse webhook json", zap.Error(err), zap.String("eventType", string(event.Type)))
	// 		return nil, huma.Error500InternalServerError("Failed to parse webhook json")
	// 	}

	// 	err = h.service.BillingService.HandleInvestmentPaymentIntentCancelled(ctx, eventBody.ID)
	// 	if err != nil {
	// 		h.logger.Error("failed to handle stripe checkout success", zap.Error(err))
	// 		return nil, huma.Error500InternalServerError("Failed to handle stripe checkout success")
	// 	}

	default:
		h.logger.Error("unhandled event type", zap.String("eventType", string(event.Type)))
		return nil, huma.Error501NotImplemented("Unhandled event type")
	}

	return nil, nil
}

func (h *httpHandler) handleStripeConnectWebhook(ctx context.Context, input *shared.HandleStripeWebhookInput) (*struct{}, error) {
	reader := bytes.NewReader(input.Body)

	payload, err := io.ReadAll(reader)
	if err != nil {
		h.logger.Error("failed to read webhook body", zap.Error(err))
		return nil, huma.Error500InternalServerError("Failed to read webhook body")
	}

	event, err := webhook.ConstructEvent(payload, input.Signature, h.stripeConnectWebhookSecret)
	if err != nil {
		h.logger.Error("webhook signature verification failed", zap.Error(err))
		return nil, huma.Error400BadRequest("Webhook signature verification failed")
	}

	switch event.Type {
	case stripe.EventTypeAccountUpdated:
		eventBody, err := shared.ParseStripeWebhook[stripe.Account](event)
		if err != nil {
			h.logger.Error("failed to parse webhook json", zap.Error(err), zap.String("eventType", string(event.Type)))
			return nil, huma.Error500InternalServerError("Failed to parse webhook json")
		}

		stripeConnectedAccountId := eventBody.ID

		businessRecord, err := h.service.BusinessService.GetByStripeConnectedAccountId(ctx, stripeConnectedAccountId)
		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				h.logger.Error("business not found", zap.String("stripeConnectedAccountId", stripeConnectedAccountId))
				return nil, huma.Error404NotFound("Business not found")
			}

			h.logger.Error("failed to fetch business", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the business")
		}

		if eventBody.Requirements.DisabledReason != "" {
			h.logger.Error("business is disabled", zap.String("stripeConnectedAccountId", stripeConnectedAccountId), zap.String("disabledReason", string(eventBody.Requirements.DisabledReason)))

			if businessRecord.StripeAccountEnabled {
				_, err = h.service.BusinessService.Update(ctx, businessRecord.ID, business.UpdateBusinessParams{
					StripeAccountEnabled: false,
				})

				if err != nil {
					h.logger.Error("failed to update business", zap.Error(err))
					return nil, huma.Error500InternalServerError("An error occurred while changing the business's stripe account enabled status")
				}
			}

			return nil, huma.Error400BadRequest("Business is disabled")
		}

		if len(eventBody.Requirements.CurrentlyDue) > 0 {
			h.logger.Error("business requires additional information", zap.String("stripeConnectedAccountId", stripeConnectedAccountId))
			return nil, huma.Error400BadRequest("Business requires additional information")
		}
		_, err = h.service.BusinessService.Update(ctx, businessRecord.ID, business.UpdateBusinessParams{
			StripeAccountEnabled: true,
		})

		if err != nil {
			h.logger.Error("failed to update business", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while changing the business's stripe account enabled status")
		}

	default:
		h.logger.Error("unhandled event type", zap.String("eventType", string(event.Type)))
		return nil, huma.Error501NotImplemented("Unhandled event type")
	}

	return nil, nil
}
