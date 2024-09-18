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
	roundService service.RoundService
	logger       *zap.Logger
}

func newHTTPHandler(roundService service.RoundService, logger *zap.Logger) *httpHandler {
	return &httpHandler{
		roundService: roundService,
		logger:       logger,
	}
}

type SingleRoundResponse struct {
	Body struct {
		shared.MessageResponse
		Round *round.Round `json:"round"`
	}
}

func (h *httpHandler) getByID(ctx context.Context, input *shared.PathIDParam) (*SingleRoundResponse, error) {
	round, err := h.roundService.GetById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("round not found")
		default:
			h.logger.Error("failed to fetch round", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the round")
		}
	}

	resp := &SingleRoundResponse{}
	resp.Body.Message = "Round fetched successfully"
	resp.Body.Round = &round

	return resp, nil
}

type GetManyRoundsOutput struct {
	Body struct {
		shared.MessageResponse
		Rounds []round.Round `json:"rounds"`
		shared.PaginationResponse
	}
}

func (h *httpHandler) getAll(ctx context.Context, input *shared.PaginationRequest) (*GetManyRoundsOutput, error) {
	LIMIT := input.Limit + 1

	rounds, err := h.roundService.GetAll(ctx, LIMIT, input.Cursor)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("rounds not found")
		default:
			h.logger.Error("failed to fetch rounds", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the rounds")
		}
	}

	resp := &GetManyRoundsOutput{}
	resp.Body.Message = "Rounds fetched successfully"
	resp.Body.Rounds = rounds

	if len(rounds) == LIMIT {
		resp.Body.NextCursor = &rounds[len(rounds)-1].ID
		resp.Body.HasMore = true
		resp.Body.Rounds = resp.Body.Rounds[:len(resp.Body.Rounds)-1]
	}

	return resp, nil
}

type GetManyRoundsByVentureIDInput struct {
	shared.PathIDParam
	shared.PaginationRequest
}

func (h *httpHandler) getAllByVentureID(ctx context.Context, input *GetManyRoundsByVentureIDInput) (*GetManyRoundsOutput, error) {
	LIMIT := input.Limit + 1

	rounds, err := h.roundService.GetByVentureId(ctx, input.ID, LIMIT, input.Cursor)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("rounds not found")
		default:
			h.logger.Error("failed to fetch rounds", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the rounds")
		}
	}

	resp := &GetManyRoundsOutput{}
	resp.Body.Message = "Rounds fetched successfully"
	resp.Body.Rounds = rounds

	if len(rounds) == LIMIT {
		resp.Body.NextCursor = &rounds[len(rounds)-1].ID
		resp.Body.HasMore = true
		resp.Body.Rounds = resp.Body.Rounds[:len(resp.Body.Rounds)-1]
	}

	return resp, nil
}

type CreateRoundInput struct {
	Body round.CreateRoundParams `json:"round"`
}

func (i *CreateRoundInput) Resolve(ctx huma.Context) []error {
	//TODO: implement db checks
	return nil
}

func (h *httpHandler) create(ctx context.Context, input *CreateRoundInput) (*SingleRoundResponse, error) {
	round, err := h.roundService.Create(ctx, input.Body)
	if err != nil {
		h.logger.Error("failed to create round", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while creating the round")
	}

	resp := &SingleRoundResponse{}
	resp.Body.Message = "Round created successfully"
	resp.Body.Round = &round

	return resp, nil
}

type UpdateRoundInput struct {
	shared.PathIDParam
	Body round.UpdateRoundParams `json:"round"`
}

func (i *UpdateRoundInput) Resolve(ctx huma.Context) []error {
	//TODO: implement db checks
	return nil
}

func (h *httpHandler) update(ctx context.Context, input *UpdateRoundInput) (*SingleRoundResponse, error) {
	_, err := h.roundService.GetById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("round not found")
		default:
			h.logger.Error("failed to fetch round", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the round")
		}
	}

	round, err := h.roundService.Update(ctx, input.ID, input.Body)

	if err != nil {
		h.logger.Error("failed to update round", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while updating the round")
	}

	resp := &SingleRoundResponse{}
	resp.Body.Message = "Round updated successfully"
	resp.Body.Round = &round

	return resp, nil
}

type DeleteRoundOutput struct {
	Body shared.MessageResponse
}

func (h *httpHandler) delete(ctx context.Context, input *shared.PathIDParam) (*DeleteRoundOutput, error) {
	_, err := h.roundService.GetById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("round not found")
		default:
			h.logger.Error("failed to fetch round", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the round")
		}
	}

	err = h.roundService.Delete(ctx, input.ID)
	if err != nil {
		h.logger.Error("failed to delete round", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while deleting the round")
	}

	resp := &DeleteRoundOutput{}
	resp.Body.Message = "Round deleted successfully"

	return resp, nil
}
