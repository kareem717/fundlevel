package investment

import (
	"context"
	"database/sql"
	"errors"
	"fundlevel/internal/entities/investment"
	"fundlevel/internal/server/handler/shared"
	"fundlevel/internal/server/utils"
	"fundlevel/internal/service"
	"fundlevel/internal/service/types"

	"github.com/danielgtaylor/huma/v2"
	"go.uber.org/zap"
)

type httpHandler struct {
	service *service.Service
	logger  *zap.Logger
}

func newHTTPHandler(service *service.Service, logger *zap.Logger) *httpHandler {
	if service == nil {
		panic("service is nil")
	}

	if logger == nil {
		panic("logger is nil")
	}

	return &httpHandler{
		service: service,
		logger:  logger,
	}
}

type UpsertInvestmentRequest struct {
	Body investment.CreateInvestmentParams
}

type SingleInvestmentResponse struct {
	Body investment.Investment
}

func (h *httpHandler) upsert(ctx context.Context, input *UpsertInvestmentRequest) (*SingleInvestmentResponse, error) {
	account := utils.GetAuthenticatedAccount(ctx)
	if account == nil {
		return nil, huma.Error401Unauthorized("You must be logged in to create an investment")
	}

	// TODO: switch to authorization service
	_, err := h.service.AccountService.GetStripeIdentity(ctx, account.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			h.logger.Error("must have a stripe identity to create an investment", zap.Int("account id", account.ID))
			return nil, huma.Error403Forbidden("Must have a stripe identity to create an investment")
		default:
			h.logger.Error("failed to fetch stripe identity", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the stripe identity")
		}
	}

	investment, err := h.service.InvestmentService.Upsert(ctx, account.ID, input.Body)
	if err != nil {
		h.logger.Error("failed to upsert investment", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while upserting the investment")
	}

	resp := &SingleInvestmentResponse{}
	resp.Body = investment

	return resp, nil
}

type UpdateInvestmentRequest struct {
	shared.PathIDParam
	Body investment.UpdateInvestmentParams
}

func (h *httpHandler) update(ctx context.Context, input *UpdateInvestmentRequest) (*SingleInvestmentResponse, error) {
	//todo: add ABAC checks
	account := utils.GetAuthenticatedAccount(ctx)
	if account == nil {
		return nil, huma.Error401Unauthorized("You must be logged in to update an investment")
	}

	investment, err := h.service.InvestmentService.GetById(ctx, input.ID)
	if err != nil {
		h.logger.Error("failed to fetch investment", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while fetching the investment")
	}

	if investment.InvestorID != account.ID {
		h.logger.Error("input account id does not match authenticated account id",
			zap.Any("input account id", investment.InvestorID),
			zap.Any("authenticated account id", account.ID))

		return nil, huma.Error403Forbidden("Cannot update investment for another account")
	}

	investment, err = h.service.InvestmentService.Update(ctx, input.ID, input.Body)
	if err != nil {
		h.logger.Error("failed to update investment", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while updating the investment")
	}

	resp := &SingleInvestmentResponse{}
	resp.Body = investment

	return resp, nil
}

type GetInvestmentPaymentIntentClientSecretInput struct {
	shared.PathIDParam
	Body struct {
		ConfirmationToken string `json:"confirmation_token"`
		ReturnURL         string `json:"return_url"`
	}
}

type InvestmentPaymentIntentClientSecretOutput struct {
	Body types.StripePaymentIntentOutput
}

func (h *httpHandler) confirmPaymentIntent(ctx context.Context, input *GetInvestmentPaymentIntentClientSecretInput) (*InvestmentPaymentIntentClientSecretOutput, error) {
	// account := shared.GetAuthenticatedAccount(ctx)
	//todo: add ABAC checks

	// just checking if the investment exists, arguably costly
	_, err := h.service.InvestmentService.GetById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			h.logger.Error("investment not found", zap.Int("investment id", input.ID))
			return nil, huma.Error404NotFound("Investment not found")
		default:
			h.logger.Error("failed to fetch investment", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the investment")
		}
	}

	payment, err := h.service.InvestmentService.ConfirmPaymentIntent(ctx, input.ID, input.Body.ConfirmationToken, input.Body.ReturnURL)
	if err != nil {
		h.logger.Error("failed to confirm payment intent", zap.Error(err))
		return nil, huma.Error500InternalServerError("Failed to confirm payment intent")
	}

	resp := &InvestmentPaymentIntentClientSecretOutput{}
	resp.Body = payment

	return resp, nil
}

func (h *httpHandler) getInvestmentById(ctx context.Context, input *shared.PathIDParam) (*shared.SingleInvestmentResponse, error) {
	investment, err := h.service.InvestmentService.GetById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			h.logger.Error("investment not found", zap.Int("investment id", input.ID))
			return nil, huma.Error404NotFound("Investment not found")
		default:
			h.logger.Error("failed to fetch investment", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the investment")
		}
	}

	account := utils.GetAuthenticatedAccount(ctx)
	if account == nil {
		return nil, huma.Error401Unauthorized("You must be logged in to fetch an investment")
	}

	if account.ID != investment.InvestorID {
		h.logger.Error("input account id does not match authenticated account id",
			zap.Any("input account id", investment.InvestorID),
			zap.Any("authenticated account id", account.ID))

		return nil, huma.Error403Forbidden("Cannot fetch investment for another account")
	}

	resp := &shared.SingleInvestmentResponse{}
	resp.Body.Message = "Investment fetched successfully"
	resp.Body.Investment = &investment

	return resp, nil
}

type GetInvestmentPaymentsOutput struct {
	Body struct {
		shared.MessageResponse
		InvestmentPayments []investment.Payment `json:"investment_payments"`
	}
}

func (h *httpHandler) getInvestmentPayments(ctx context.Context, input *shared.PathIDParam) (*GetInvestmentPaymentsOutput, error) {
	//todo: add ABAC checks

	payments, err := h.service.InvestmentService.GetPayments(ctx, input.ID)
	if err != nil {
		h.logger.Error("failed to fetch investment payments", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while fetching the investment payments")
	}

	resp := &GetInvestmentPaymentsOutput{}
	resp.Body.Message = "Investment payments fetched successfully"
	resp.Body.InvestmentPayments = payments

	return resp, nil
}

type GetInvestmentActivePaymentOutput struct {
	Body struct {
		shared.MessageResponse
		InvestmentPayment investment.Payment `json:"investment_payment"`
	}
}

func (h *httpHandler) getInvestmentActivePayment(ctx context.Context, input *shared.PathIDParam) (*GetInvestmentActivePaymentOutput, error) {
	//todo: check if shares still available
	investment, err := h.service.InvestmentService.GetById(ctx, input.ID)
	if err != nil {
		h.logger.Error("failed to fetch investment", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while fetching the investment")
	}

	roundRecord, err := h.service.RoundService.GetById(ctx, investment.RoundID)
	if err != nil {
		h.logger.Error("failed to fetch round", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while fetching the round")
	}

	if roundRecord.RemainingShares <= investment.ShareQuantity {
		h.logger.Error("not enough shares available", zap.Int("shares available", roundRecord.RemainingShares), zap.Int("shares ordered", investment.ShareQuantity))
		return nil, huma.Error400BadRequest("Not enough shares available")
	}

	payment, err := h.service.InvestmentService.GetCurrentPayment(ctx, input.ID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			h.logger.Error("investment active payment not found", zap.Int("investment id", input.ID))
			return nil, huma.Error404NotFound("Investment does not have an active payment")
		}

		h.logger.Error("failed to fetch investment active payment", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while fetching the investment active payment")
	}

	resp := &GetInvestmentActivePaymentOutput{}
	resp.Body.Message = "Investment active payment fetched successfully"
	resp.Body.InvestmentPayment = payment

	return resp, nil
}
