package analytic

import (
	"context"
	"database/sql"
	"errors"
	"fundlevel/internal/entities/analytic"
	"fundlevel/internal/server/handler/shared"
	"fundlevel/internal/service"

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

type ImpressionInput struct {
	shared.PathIDParam
	Body struct {
		AccountID int `json:"accountId" minimum:"1"`
	}
}

func (h *httpHandler) createRoundImpression(ctx context.Context, input *ImpressionInput) (*shared.MessageOutput, error) {
	account := shared.GetAuthenticatedAccount(ctx)

	if account.ID != input.Body.AccountID {
		h.logger.Error("account id does not match authenticated account id",
			zap.Any("authenticated account id", account.ID),
			zap.Any("input account id", input.Body.AccountID))

		return nil, huma.Error403Forbidden("Cannot view as another account")
	}

	err := h.service.AnalyticService.CreateRoundImpression(ctx, analytic.CreateRoundImpressionParams{
		RoundID:   input.ID,
		AccountID: input.Body.AccountID,
	})

	if err != nil {
		h.logger.Error("failed to create round impression", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while creating the round impression")
	}

	resp := &shared.MessageOutput{}
	resp.Body.Message = "Round impression created successfully"

	return resp, nil
}

func (h *httpHandler) createVentureImpression(ctx context.Context, input *ImpressionInput) (*shared.MessageOutput, error) {
	account := shared.GetAuthenticatedAccount(ctx)

	if account.ID != input.Body.AccountID {
		h.logger.Error("account id does not match authenticated account id",
			zap.Any("authenticated account id", account.ID),
			zap.Any("input account id", input.Body.AccountID))

		return nil, huma.Error403Forbidden("Cannot view as another account")
	}

	err := h.service.AnalyticService.CreateVentureImpression(ctx, analytic.CreateVentureImpressionParams{
		VentureID: input.ID,
		AccountID: input.Body.AccountID,
	})

	if err != nil {
		h.logger.Error("failed to create venture impression", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while creating the venture impression")
	}

	resp := &shared.MessageOutput{}
	resp.Body.Message = "Venture impression created successfully"

	return resp, nil
}

func (h *httpHandler) createBusinessImpression(ctx context.Context, input *ImpressionInput) (*shared.MessageOutput, error) {
	account := shared.GetAuthenticatedAccount(ctx)
	//! this doesn't check if the business exists to minimize exec time

	if account.ID != input.Body.AccountID {
		h.logger.Error("account id does not match authenticated account id",
			zap.Any("authenticated account id", account.ID),
			zap.Any("input account id", input.Body.AccountID))

		return nil, huma.Error403Forbidden("Cannot view as another account")
	}

	err := h.service.AnalyticService.CreateBusinessImpression(ctx, analytic.CreateBusinessImpressionParams{
		BusinessID: input.ID,
		AccountID:  input.Body.AccountID,
	})

	if err != nil {
		h.logger.Error("failed to create business impression", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while creating the business impression")
	}

	resp := &shared.MessageOutput{}
	resp.Body.Message = "Business impression created successfully"

	return resp, nil
}

type ImpressionCountOutput struct {
	Body struct {
		shared.MessageResponse
		Count int `json:"count"`
	}
}

func (h *httpHandler) getRoundImpressionCount(ctx context.Context, input *shared.PathIDParam) (*ImpressionCountOutput, error) {
	_, err := h.service.RoundService.GetById(ctx, input.ID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			h.logger.Error("round not found", zap.Int("round id", input.ID))
			return nil, huma.Error404NotFound("Round not found")
		}

		h.logger.Error("failed to get round", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while getting the round")
	}

	count, err := h.service.AnalyticService.GetRoundImpressionCount(ctx, input.ID)
	if err != nil {
		h.logger.Error("failed to get round impression count", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while getting the round impression count")
	}

	resp := &ImpressionCountOutput{}
	resp.Body.Message = "Round impression count fetched successfully"
	resp.Body.Count = count

	return resp, nil
}

func (h *httpHandler) getVentureImpressionCount(ctx context.Context, input *shared.PathIDParam) (*ImpressionCountOutput, error) {
	_, err := h.service.VentureService.GetById(ctx, input.ID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			h.logger.Error("venture not found", zap.Int("venture id", input.ID))
			return nil, huma.Error404NotFound("Venture not found")
		}
	}

	count, err := h.service.AnalyticService.GetVentureImpressionCount(ctx, input.ID)
	if err != nil {
		h.logger.Error("failed to get venture impression count", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while getting the venture impression count")
	}

	resp := &ImpressionCountOutput{}
	resp.Body.Message = "Venture impression count fetched successfully"
	resp.Body.Count = count

	return resp, nil
}

func (h *httpHandler) getBusinessImpressionCount(ctx context.Context, input *shared.PathIDParam) (*ImpressionCountOutput, error) {
	_, err := h.service.BusinessService.GetById(ctx, input.ID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			h.logger.Error("business not found", zap.Int("business id", input.ID))
			return nil, huma.Error404NotFound("Business not found")
		}
	}

	count, err := h.service.AnalyticService.GetBusinessImpressionCount(ctx, input.ID)
	if err != nil {
		h.logger.Error("failed to get business impression count", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while getting the business impression count")
	}

	resp := &ImpressionCountOutput{}
	resp.Body.Message = "Business impression count fetched successfully"
	resp.Body.Count = count

	return resp, nil
}
