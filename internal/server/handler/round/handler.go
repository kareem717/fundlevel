package round

import (
	"context"
	"database/sql"
	"errors"

	"fundlevel/internal/entities/round"
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

type SingleFixedTotalRoundResponse struct {
	Body struct {
		shared.MessageResponse
		Round *round.FixedTotalRound `json:"round"`
	}
}

func (h *httpHandler) getFixedTotalById(ctx context.Context, input *shared.PathIDParam) (*SingleFixedTotalRoundResponse, error) {
	round, err := h.service.RoundService.GetFixedTotalById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("round not found")
		default:
			h.logger.Error("failed to fetch round", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the round")
		}
	}

	resp := &SingleFixedTotalRoundResponse{}
	resp.Body.Message = "Round fetched successfully"
	resp.Body.Round = &round

	return resp, nil
}

func (h *httpHandler) getOffsetPaginatedFixedTotalRounds(ctx context.Context, input *shared.OffsetPaginationRequest) (*shared.GetOffsetPaginatedFixedTotalRoundsOutput, error) {
	rounds, err := h.service.RoundService.GetFixedTotalRoundsByPage(ctx, input.PageSize, input.Page)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("rounds not found")
		default:
			h.logger.Error("failed to fetch rounds", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the rounds")
		}
	}

	resp := &shared.GetOffsetPaginatedFixedTotalRoundsOutput{}
	resp.Body.Message = "Rounds fetched successfully"
	resp.Body.FixedTotalRounds = rounds

	if len(rounds) > input.PageSize {
		resp.Body.HasMore = true
		resp.Body.FixedTotalRounds = resp.Body.FixedTotalRounds[:input.PageSize]
	}

	return resp, nil
}

func (h *httpHandler) getCursorPaginatedFixedTotalRounds(ctx context.Context, input *shared.CursorPaginationRequest) (*shared.GetCursorPaginatedFixedTotalRoundsOutput, error) {
	limit := input.Limit + 1
	rounds, err := h.service.RoundService.GetFixedTotalRoundsByCursor(ctx, limit, input.Cursor)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("rounds not found")
		default:
			h.logger.Error("failed to fetch rounds", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the rounds")
		}
	}

	resp := &shared.GetCursorPaginatedFixedTotalRoundsOutput{}
	resp.Body.Message = "Rounds fetched successfully"
	resp.Body.FixedTotalRounds = rounds

	if len(rounds) == limit {
		resp.Body.NextCursor = &rounds[input.Limit].Round.ID
		resp.Body.HasMore = true
		resp.Body.FixedTotalRounds = resp.Body.FixedTotalRounds[:input.Limit]
	}

	return resp, nil
}

type CreateRoundInput struct {
	Body round.CreateFixedTotalRoundParams `json:"round"`
}

func (i *CreateRoundInput) Resolve(ctx huma.Context) []error {
	//TODO: implement db checks
	return nil
}

func (h *httpHandler) createFixedTotalRound(ctx context.Context, input *CreateRoundInput) (*SingleFixedTotalRoundResponse, error) {
	round, err := h.service.RoundService.CreateFixedTotalRound(ctx, input.Body)
	if err != nil {
		h.logger.Error("failed to create round", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while creating the round")
	}

	resp := &SingleFixedTotalRoundResponse{}
	resp.Body.Message = "Round created successfully"
	resp.Body.Round = &round

	return resp, nil
}

type DeleteRoundOutput struct {
	Body shared.MessageResponse
}

func (h *httpHandler) deleteFixedTotalRound(ctx context.Context, input *shared.PathIDParam) (*DeleteRoundOutput, error) {
	_, err := h.service.RoundService.GetFixedTotalById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("round not found")
		default:
			h.logger.Error("failed to fetch round", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the round")
		}
	}

	err = h.service.RoundService.DeleteFixedTotalRound(ctx, input.ID)
	if err != nil {
		h.logger.Error("failed to delete round", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while deleting the round")
	}

	resp := &DeleteRoundOutput{}
	resp.Body.Message = "Round deleted successfully"

	return resp, nil
}
