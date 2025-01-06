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

type FavouriteInput struct {
	shared.PathIDParam
	AccountID int `path:"accountId" minimum:"1"`
}

func (h *httpHandler) createRoundFavourite(ctx context.Context, input *FavouriteInput) (*shared.MessageOutput, error) {
	account := shared.GetAuthenticatedAccount(ctx)

	if account.ID != input.AccountID {
		h.logger.Error("account id does not match authenticated account id",
			zap.Any("authenticated account id", account.ID),
			zap.Any("input account id", input.AccountID))

		return nil, huma.Error403Forbidden("Cannot like for another account")
	}

	err := h.service.AnalyticService.CreateRoundFavourite(ctx, analytic.CreateRoundFavouriteParams{
		RoundID:   input.ID,
		AccountID: input.AccountID,
	})

	if err != nil {
		h.logger.Error("failed to create round like", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while creating the round like")
	}

	resp := &shared.MessageOutput{}
	resp.Body.Message = "Round favourited successfully"

	return resp, nil
}

func (h *httpHandler) deleteRoundFavourite(ctx context.Context, input *FavouriteInput) (*shared.MessageOutput, error) {
	account := shared.GetAuthenticatedAccount(ctx)

	if account.ID != input.AccountID {
		h.logger.Error("account id does not match authenticated account id",
			zap.Any("authenticated account id", account.ID),
			zap.Any("input account id", input.AccountID))

		return nil, huma.Error403Forbidden("Cannot delete like for another account")
	}

	err := h.service.AnalyticService.DeleteRoundFavourite(ctx, input.ID, input.AccountID)
	if err != nil {
		h.logger.Error("failed to delete round like", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while deleting the round like")
	}

	resp := &shared.MessageOutput{}
	resp.Body.Message = "Round favourited deleted successfully"

	return resp, nil
}

func (h *httpHandler) isRoundFavouritedByAccount(ctx context.Context, input *FavouriteInput) (*shared.IsFavouritedOutput, error) {
	account := shared.GetAuthenticatedAccount(ctx)

	if account.ID != input.AccountID {
		h.logger.Error("account id does not match authenticated account id",
			zap.Any("authenticated account id", account.ID),
			zap.Any("input account id", input.AccountID))

		return nil, huma.Error403Forbidden("Cannot check if round is liked by another account")
	}

	favourited, err := h.service.AnalyticService.IsRoundFavouritedByAccount(ctx, input.ID, input.AccountID)
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

func (h *httpHandler) createBusinessFavourite(ctx context.Context, input *FavouriteInput) (*shared.MessageOutput, error) {
	account := shared.GetAuthenticatedAccount(ctx)

	if account.ID != input.AccountID {
		h.logger.Error("account id does not match authenticated account id",
			zap.Any("authenticated account id", account.ID),
			zap.Any("input account id", input.AccountID))

		return nil, huma.Error403Forbidden("Cannot like for another account")
	}

	_, err := h.service.BusinessService.GetById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("Business not found")
		default:
			h.logger.Error("failed to fetch business", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the business")
		}
	}

	err = h.service.AnalyticService.CreateBusinessFavourite(ctx, analytic.CreateBusinessFavouriteParams{
		BusinessID: input.ID,
		AccountID:  input.AccountID,
	})

	if err != nil {
		h.logger.Error("failed to create business like", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while creating the business like")
	}

	resp := &shared.MessageOutput{}
	resp.Body.Message = "Business favourited successfully"

	return resp, nil
}

func (h *httpHandler) deleteBusinessFavourite(ctx context.Context, input *FavouriteInput) (*shared.MessageOutput, error) {
	account := shared.GetAuthenticatedAccount(ctx)

	if account.ID != input.AccountID {
		h.logger.Error("account id does not match authenticated account id",
			zap.Any("authenticated account id", account.ID),
			zap.Any("input account id", input.AccountID))

		return nil, huma.Error403Forbidden("Cannot delete like for another account")
	}

	_, err := h.service.BusinessService.GetById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("Business not found")
		default:
			h.logger.Error("failed to fetch business", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the business")
		}
	}

	err = h.service.AnalyticService.DeleteBusinessFavourite(ctx, input.ID, input.AccountID)
	if err != nil {
		h.logger.Error("failed to delete business like", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while deleting the business like")
	}

	resp := &shared.MessageOutput{}
	resp.Body.Message = "Business favourited deleted successfully"

	return resp, nil
}

func (h *httpHandler) isBusinessFavouritedByAccount(ctx context.Context, input *FavouriteInput) (*shared.IsFavouritedOutput, error) {
	account := shared.GetAuthenticatedAccount(ctx)

	if account.ID != input.AccountID {
		h.logger.Error("account id does not match authenticated account id",
			zap.Any("authenticated account id", account.ID),
			zap.Any("input account id", input.AccountID))

		return nil, huma.Error403Forbidden("Cannot check if business is liked by another account")
	}

	favourited, err := h.service.AnalyticService.IsBusinessFavouritedByAccount(ctx, input.ID, input.AccountID)
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

type GetDailyAggregatedAnalyticsInput struct {
	shared.PathIDParam
	MinDayOfYear int `query:"minDayOfYear" min:"0" max:"366" multipleOf:"1" default:"0" required:"false"`
	MaxDayOfYear int `query:"maxDayOfYear" min:"0" max:"366" multipleOf:"1" default:"366" required:"false"`
}

type GetDailyAggregatedBusinessAnalyticsOutput struct {
	Body struct {
		shared.MessageResponse
		Analytics []analytic.SimplifiedDailyAggregatedBusinessAnalytics `json:"analytics"`
	} `json:"body"`
}

func (h *httpHandler) getDailyAggregatedBusinessAnalytics(ctx context.Context, input *GetDailyAggregatedAnalyticsInput) (*GetDailyAggregatedBusinessAnalyticsOutput, error) {
	business, err := h.service.BusinessService.GetById(ctx, input.ID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			h.logger.Error("tried to get daily aggregated business analytics for a non-existent business", zap.Error(err), zap.Int("business_id", input.ID))
		} else {
			h.logger.Error("failed to get business", zap.Error(err), zap.Int("business_id", input.ID))
		}

		return nil, huma.Error500InternalServerError("An error occurred while getting the business")
	}

	account := shared.GetAuthenticatedAccount(ctx)

	authorized, err := h.service.PermissionService.CanViewBusinessAnalytics(ctx, account.ID, business.ID)
	if err != nil {
		h.logger.Error("failed to check if account can view business analytics", zap.Error(err), zap.Int("business_id", input.ID), zap.Int("account_id", account.ID))
		return nil, huma.Error500InternalServerError("An error occurred while checking if the account can view business analytics")
	}

	if !authorized {
		h.logger.Error("account does not have permission to view business analytics", zap.Int("business_id", input.ID), zap.Int("account_id", account.ID))
		return nil, huma.Error403Forbidden("Account does not have permission to view business analytics")
	}

	businessAnalytics, err := h.service.AnalyticService.GetDailyAggregatedBusinessAnalytics(ctx, business.ID, input.MinDayOfYear, input.MaxDayOfYear)
	if err != nil {
		h.logger.Error("failed to get daily aggregated business analytics", zap.Error(err), zap.Int("business_id", input.ID))
		return nil, huma.Error500InternalServerError("An error occurred while getting the daily aggregated business analytics")
	}

	resp := &GetDailyAggregatedBusinessAnalyticsOutput{}
	resp.Body.Message = "Daily aggregated business analytics fetched successfully"
	resp.Body.Analytics = businessAnalytics

	return resp, nil
}

type GetDailyAggregatedRoundAnalyticsOutput struct {
	Body struct {
		shared.MessageResponse
		Analytics []analytic.SimplifiedDailyAggregatedRoundAnalytics `json:"analytics"`
	} `json:"body"`
}

func (h *httpHandler) getDailyAggregatedRoundAnalytics(ctx context.Context, input *GetDailyAggregatedAnalyticsInput) (*GetDailyAggregatedRoundAnalyticsOutput, error) {
	round, err := h.service.RoundService.GetById(ctx, input.ID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			h.logger.Error("tried to get daily aggregated round analytics for a non-existent round", zap.Error(err), zap.Int("round_id", input.ID))
		} else {
			h.logger.Error("failed to get round", zap.Error(err), zap.Int("round_id", input.ID))
		}

		return nil, huma.Error500InternalServerError("An error occurred while getting the round")
	}

	account := shared.GetAuthenticatedAccount(ctx)

	authorized, err := h.service.PermissionService.CanViewRoundAnalytics(ctx, account.ID, round.ID)
	if err != nil {
		h.logger.Error("failed to check if account can view round analytics", zap.Error(err), zap.Int("round_id", input.ID), zap.Int("account_id", account.ID))
		return nil, huma.Error500InternalServerError("An error occurred while checking if the account can view round analytics")
	}

	if !authorized {
		h.logger.Error("account does not have permission to view round analytics", zap.Int("round_id", input.ID), zap.Int("account_id", account.ID))
		return nil, huma.Error403Forbidden("Account does not have permission to view round analytics")
	}

	roundAnalytics, err := h.service.AnalyticService.GetDailyAggregatedRoundAnalytics(ctx, round.ID, input.MinDayOfYear, input.MaxDayOfYear)
	if err != nil {
		h.logger.Error("failed to get daily aggregated round analytics", zap.Error(err), zap.Int("round_id", input.ID))
		return nil, huma.Error500InternalServerError("An error occurred while getting the daily aggregated round analytics")
	}

	resp := &GetDailyAggregatedRoundAnalyticsOutput{}
	resp.Body.Message = "Daily aggregated round analytics fetched successfully"
	resp.Body.Analytics = roundAnalytics

	return resp, nil
}
