package analytic

import (
	"context"
	"fundlevel/internal/server/handler/shared"
	"fundlevel/internal/server/utils"
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

type CreateRoundImpressionInput struct {
	shared.IdParam
}

func (h *httpHandler) createRoundImpression(ctx context.Context, input *CreateRoundImpressionInput) (*shared.MessageOutput, error) {
	account := utils.GetAuthenticatedAccount(ctx)
	if account == nil {
		return nil, huma.Error401Unauthorized("Unauthorized")
	}

	err := h.service.AnalyticService.CreateRoundImpression(ctx, input.ID, account.ID)

	if err != nil {
		h.logger.Error("failed to create round impression", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while creating the round impression")
	}

	resp := &shared.MessageOutput{}
	resp.Body.Message = "Round impression created successfully"

	return resp, nil
}

type CreateBusinessImpressionInput struct {
	shared.IdParam
}

func (h *httpHandler) createBusinessImpression(ctx context.Context, input *CreateBusinessImpressionInput) (*shared.MessageOutput, error) {
	account := utils.GetAuthenticatedAccount(ctx)
	if account == nil {
		return nil, huma.Error401Unauthorized("Unauthorized")
	}

	err := h.service.AnalyticService.CreateBusinessImpression(ctx, input.ID, account.ID)

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

func (h *httpHandler) getBusinessImpressionCount(ctx context.Context, input *shared.PathIDParam) (*ImpressionCountOutput, error) {
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

func (h *httpHandler) createRoundFavourite(ctx context.Context, input *shared.PathIDParam) (*shared.MessageOutput, error) {
	account := utils.GetAuthenticatedAccount(ctx)
	if account == nil {
		return nil, huma.Error401Unauthorized("Unauthorized")
	}

	err := h.service.AnalyticService.CreateRoundFavourite(ctx, input.ID, account.ID)

	if err != nil {
		h.logger.Error("failed to create round like", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while creating the round like")
	}

	resp := &shared.MessageOutput{}
	resp.Body.Message = "Round favourited successfully"

	return resp, nil
}

func (h *httpHandler) deleteRoundFavourite(ctx context.Context, input *shared.PathIDParam) (*shared.MessageOutput, error) {
	account := utils.GetAuthenticatedAccount(ctx)
	if account == nil {
		return nil, huma.Error401Unauthorized("Unauthorized")
	}

	err := h.service.AnalyticService.DeleteRoundFavourite(ctx, input.ID, account.ID)
	if err != nil {
		h.logger.Error("failed to delete round like", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while deleting the round like")
	}

	resp := &shared.MessageOutput{}
	resp.Body.Message = "Round favourited deleted successfully"

	return resp, nil
}

func (h *httpHandler) isRoundFavouritedByAccount(ctx context.Context, input *shared.PathIDParam) (*shared.IsFavouritedOutput, error) {
	account := utils.GetAuthenticatedAccount(ctx)
	if account == nil {
		return nil, huma.Error401Unauthorized("Unauthorized")
	}

	favourited, err := h.service.AnalyticService.IsRoundFavouritedByAccount(ctx, input.ID, account.ID)
	if err != nil {
		h.logger.Error("failed to check if round is liked by account", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while checking if the round is liked by the account")
	}

	resp := &shared.IsFavouritedOutput{}
	resp.Body.Message = "Round favourited status fetched successfully"
	resp.Body.Favourited = favourited

	return resp, nil
}

func (h *httpHandler) getRoundFavouriteCount(ctx context.Context, input *shared.PathIDParam) (*shared.GetLikeCountOutput, error) {
	count, err := h.service.AnalyticService.GetRoundFavouriteCount(ctx, input.ID)
	if err != nil {
		h.logger.Error("failed to get round like count", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while getting the round like count")
	}

	resp := &shared.GetLikeCountOutput{}
	resp.Body.Message = "Round favourited count fetched successfully"
	resp.Body.Count = count

	return resp, nil
}

func (h *httpHandler) createBusinessFavourite(ctx context.Context, input *shared.PathIDParam) (*shared.MessageOutput, error) {
	account := utils.GetAuthenticatedAccount(ctx)
	if account == nil {
		return nil, huma.Error401Unauthorized("Unauthorized")
	}

	err := h.service.AnalyticService.CreateBusinessFavourite(ctx, input.ID, account.ID)

	if err != nil {
		h.logger.Error("failed to create business like", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while creating the business like")
	}

	resp := &shared.MessageOutput{}
	resp.Body.Message = "Business favourited successfully"

	return resp, nil
}

func (h *httpHandler) deleteBusinessFavourite(ctx context.Context, input *shared.PathIDParam) (*shared.MessageOutput, error) {
	account := utils.GetAuthenticatedAccount(ctx)
	if account == nil {
		return nil, huma.Error401Unauthorized("Unauthorized")
	}

	err := h.service.AnalyticService.DeleteBusinessFavourite(ctx, input.ID, account.ID)
	if err != nil {
		h.logger.Error("failed to delete business like", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while deleting the business like")
	}

	resp := &shared.MessageOutput{}
	resp.Body.Message = "Business favourited deleted successfully"

	return resp, nil
}

func (h *httpHandler) isBusinessFavouritedByAccount(ctx context.Context, input *shared.PathIDParam) (*shared.IsFavouritedOutput, error) {
	account := utils.GetAuthenticatedAccount(ctx)
	if account == nil {
		return nil, huma.Error401Unauthorized("Unauthorized")
	}

	favourited, err := h.service.AnalyticService.IsBusinessFavouritedByAccount(ctx, input.ID, account.ID)
	if err != nil {
		h.logger.Error("failed to check if business is liked by account", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while checking if the business is liked by the account")
	}

	resp := &shared.IsFavouritedOutput{}
	resp.Body.Message = "Business favourited status fetched successfully"
	resp.Body.Favourited = favourited

	return resp, nil
}

func (h *httpHandler) getBusinessFavouriteCount(ctx context.Context, input *shared.PathIDParam) (*shared.GetLikeCountOutput, error) {
	count, err := h.service.AnalyticService.GetBusinessFavouriteCount(ctx, input.ID)
	if err != nil {
		h.logger.Error("failed to get business like count", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while getting the business like count")
	}

	resp := &shared.GetLikeCountOutput{}
	resp.Body.Message = "Business favourited count fetched successfully"
	resp.Body.Count = count

	return resp, nil
}
