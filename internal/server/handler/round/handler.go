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

func (h *httpHandler) getByID(ctx context.Context, input *shared.PathIDParam) (*SingleFixedTotalRoundResponse, error) {
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

func (h *httpHandler) getMany(ctx context.Context, input *shared.PaginationRequest) (*shared.GetManyFixedTotalRoundsOutput, error) {
	LIMIT := input.Limit + 1

	var rounds []round.FixedTotalRound
	var err error

	if input.CursorPagination != nil {
		rounds, err = h.service.RoundService.GetFixedTotalRoundsByCursor(ctx, LIMIT, input.Cursor)
	} else {
		rounds, err = h.service.RoundService.GetFixedTotalRoundsByPage(ctx, LIMIT, input.Cursor)
	}

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("rounds not found")
		default:
			h.logger.Error("failed to fetch rounds", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the rounds")
		}
	}

	resp := &shared.GetManyFixedTotalRoundsOutput{}
	resp.Body.Message = "Rounds fetched successfully"
	resp.Body.FixedTotalRounds = rounds

	if len(rounds) == LIMIT {
		resp.Body.NextCursor = &rounds[len(rounds)-1].Round.ID
		resp.Body.HasMore = true
		resp.Body.FixedTotalRounds = resp.Body.FixedTotalRounds[:len(resp.Body.FixedTotalRounds)-1]
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

func (h *httpHandler) create(ctx context.Context, input *CreateRoundInput) (*SingleFixedTotalRoundResponse, error) {
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

func (h *httpHandler) delete(ctx context.Context, input *shared.PathIDParam) (*DeleteRoundOutput, error) {
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
