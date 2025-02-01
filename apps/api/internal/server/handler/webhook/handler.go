package webhook

import (
	"bytes"
	"context"
	"database/sql"
	"errors"
	"fundlevel/internal/entities/account"
	"fundlevel/internal/entities/business"
	"fundlevel/internal/server/handler/shared"
	"fundlevel/internal/service"
	"io"
	"strconv"

	"github.com/danielgtaylor/huma/v2"
	"github.com/stripe/stripe-go/v81"
	"github.com/stripe/stripe-go/v81/webhook"
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
		switch {
		case errors.Is(err, webhook.ErrNoValidSignature):
			h.logger.Error("webhook signature verification failed", zap.Error(err))
			return nil, huma.Error401Unauthorized("No valid signature provided")
		case errors.Is(err, webhook.ErrNotSigned):
			h.logger.Error("webhook signature verification failed", zap.Error(err))
			return nil, huma.Error400BadRequest("No webhook secret provided")
		case errors.Is(err, webhook.ErrTooOld):
			h.logger.Error("webhook signature verification failed")
			return nil, huma.Error400BadRequest("Webhook too old")
		case errors.Is(err, webhook.ErrInvalidHeader):
			h.logger.Error("webhook signature verification failed", zap.Error(err))
			return nil, huma.Error400BadRequest("Invalid webhook header provided")
		default:
			h.logger.Error("webhook signature verification failed", zap.Error(err))
			return nil, huma.Error500InternalServerError("Failed to parse webhook")
		}
	}

	switch event.Type {
	case stripe.EventTypePaymentIntentSucceeded:
		eventBody, err := shared.ParseStripeWebhook[stripe.PaymentIntent](event)
		if err != nil {
			h.logger.Error("failed to parse webhook json", zap.Error(err), zap.String("eventType", string(event.Type)))
			return nil, huma.Error500InternalServerError("Failed to parse webhook json")
		}

		err = h.service.InvestmentService.HandleStripePaymentIntentSucceeded(ctx, eventBody.ID)
		if err != nil {
			h.logger.Error("failed to handle stripe payment intent success", zap.Error(err))
			return nil, huma.Error500InternalServerError("Failed to handle stripe payment intent success")
		}

	case stripe.EventTypePaymentIntentCanceled:
		eventBody, err := shared.ParseStripeWebhook[stripe.PaymentIntent](event)
		if err != nil {
			h.logger.Error("failed to parse webhook json", zap.Error(err), zap.String("eventType", string(event.Type)))
			return nil, huma.Error500InternalServerError("Failed to parse webhook json")
		}

		err = h.service.InvestmentService.HandleStripePaymentIntentFailed(ctx, eventBody.ID)
		if err != nil {
			h.logger.Error("failed to handle stripe payment intent success", zap.Error(err))
			return nil, huma.Error500InternalServerError("Failed to handle stripe payment intent success")
		}

	case stripe.EventTypePaymentIntentAmountCapturableUpdated,
		stripe.EventTypePaymentIntentPartiallyFunded,
		stripe.EventTypePaymentIntentProcessing,
		stripe.EventTypePaymentIntentRequiresAction:
		eventBody, err := shared.ParseStripeWebhook[stripe.PaymentIntent](event)
		if err != nil {
			h.logger.Error("failed to parse webhook json", zap.Error(err), zap.String("eventType", string(event.Type)))
			return nil, huma.Error500InternalServerError("Failed to parse webhook json")
		}

		err = h.service.InvestmentService.HandleStripePaymentIntentStatusUpdated(ctx, eventBody.ID)
		if err != nil {
			h.logger.Error("failed to handle stripe payment intent success", zap.Error(err))
			return nil, huma.Error500InternalServerError("Failed to handle stripe payment intent success")
		}

	case stripe.EventTypeIdentityVerificationSessionVerified:
		eventBody, err := shared.ParseStripeWebhook[stripe.IdentityVerificationSession](event)
		if err != nil {
			h.logger.Error("failed to parse webhook json", zap.Error(err), zap.String("eventType", string(event.Type)))
			return nil, huma.Error500InternalServerError("Failed to parse webhook json")
		}

		parsedClientReferenceID, err := strconv.Atoi(eventBody.ClientReferenceID)
		if err != nil {
			h.logger.Error("failed to parse client reference id", zap.Error(err))
			return nil, huma.Error500InternalServerError("Failed to parse client reference id")
		}

		status := account.StripeIdentityStatus(eventBody.Status)
		if status != account.StripeIdentityStatusVerified {
			h.logger.Error("identity verification session not verified", zap.String("clientReferenceID", eventBody.ClientReferenceID), zap.String("status", string(status)))
			return nil, huma.Error500InternalServerError("Identity verification session not verified")
		}

		_, err = h.service.AccountService.CreateStripeIdentity(ctx, parsedClientReferenceID, account.CreateStripeIdentityParams{
			Status:   status,
			RemoteID: eventBody.ID,
		})
		if err != nil {
			h.logger.Error("failed to create stripe identity", zap.Error(err))
			return nil, huma.Error500InternalServerError("Failed to create stripe identity")
		}

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
		switch {
		case errors.Is(err, webhook.ErrNoValidSignature):
			h.logger.Error("webhook signature verification failed", zap.Error(err))
			return nil, huma.Error401Unauthorized("No valid signature provided")
		case errors.Is(err, webhook.ErrNotSigned):
			h.logger.Error("webhook signature verification failed", zap.Error(err))
			return nil, huma.Error400BadRequest("No webhook secret provided")
		case errors.Is(err, webhook.ErrTooOld):
			h.logger.Error("webhook signature verification failed")
			return nil, huma.Error400BadRequest("Webhook too old")
		case errors.Is(err, webhook.ErrInvalidHeader):
			h.logger.Error("webhook signature verification failed", zap.Error(err))
			return nil, huma.Error400BadRequest("Invalid webhook header provided")
		default:
			h.logger.Error("webhook signature verification failed", zap.Error(err))
			return nil, huma.Error500InternalServerError("Failed to parse webhook")
		}
	}

	switch event.Type {
	case stripe.EventTypeAccountUpdated:
		eventBody, err := shared.ParseStripeWebhook[stripe.Account](event)
		if err != nil {
			h.logger.Error("failed to parse webhook json", zap.Error(err), zap.String("eventType", string(event.Type)))
			return nil, huma.Error500InternalServerError("Failed to parse webhook json")
		}

		stripeConnectedAccountId := eventBody.ID

		stripeAccount, err := h.service.BusinessService.GetStripeAccountByAccountId(ctx, stripeConnectedAccountId)
		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				h.logger.Error("business not found", zap.String("stripeConnectedAccountId", stripeConnectedAccountId))
				return nil, huma.Error404NotFound("Business not found")
			}

			h.logger.Error("failed to fetch business", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the business")
		}

		var updateParams business.UpdateBusinessStripeAccountParams
		hasToUpdate := false

		if eventBody.Requirements.DisabledReason != "" {
			h.logger.Error("business is disabled", zap.String("stripeConnectedAccountId", stripeConnectedAccountId), zap.String("disabledReason", string(eventBody.Requirements.DisabledReason)))
			updateParams.StripeDisabledReason = &eventBody.Requirements.DisabledReason
			hasToUpdate = true
		} else if stripeAccount.StripeDisabledReason != nil {
			updateParams.StripeDisabledReason = nil
			hasToUpdate = true
		}

		//todo: handle currently due
		// if len(eventBody.Requirements.CurrentlyDue) > 0 {
		// 	h.logger.Error("business requires additional information", zap.String("stripeConnectedAccountId", stripeConnectedAccountId))
		// 	return nil, huma.Error400BadRequest("Business requires additional information")
		// }
		if eventBody.PayoutsEnabled != stripeAccount.StripePayoutsEnabled {
			updateParams.StripePayoutsEnabled = eventBody.PayoutsEnabled
			hasToUpdate = true
		}

		switch eventBody.Capabilities.Transfers {
		case stripe.AccountCapabilityStatusActive:
			if !stripeAccount.StripeTransfersEnabled {
				updateParams.StripeTransfersEnabled = true
				hasToUpdate = true
			}
		default:
			if stripeAccount.StripeTransfersEnabled {
				updateParams.StripeTransfersEnabled = false
				hasToUpdate = true
			}
		}

		if hasToUpdate {
			_, err := h.service.BusinessService.UpdateStripeAccount(ctx, stripeAccount.BusinessID, updateParams)
			if err != nil {
				h.logger.Error("failed to update business", zap.Error(err))
				return nil, huma.Error500InternalServerError("An error occurred while changing the business's stripe account enabled status")
			}
		}
	default:
		h.logger.Error("unhandled event type", zap.String("eventType", string(event.Type)))
		return nil, huma.Error501NotImplemented("Unhandled event type")
	}

	return nil, nil
}
