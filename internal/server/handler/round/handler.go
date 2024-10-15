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

type CreateRoundInput struct {
	Body round.CreateRoundParams `json:"round"`
}

func (i *CreateRoundInput) Resolve(ctx huma.Context) []error {
	//TODO: implement db checks
	return nil
}

func (h *httpHandler) create(ctx context.Context, input *CreateRoundInput) (*SingleRoundResponse, error) {
	round, err := h.service.RoundService.Create(ctx, input.Body)
	if err != nil {
		h.logger.Error("failed to create round", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while creating the round")
	}

	resp := &SingleRoundResponse{}
	resp.Body.Message = "Round created successfully"
	resp.Body.Round = &round

	return resp, nil
}

func (h *httpHandler) delete(ctx context.Context, input *shared.PathIDParam) (*shared.MessageResponse, error) {
	_, err := h.service.RoundService.GetById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("round not found")
		default:
			h.logger.Error("failed to fetch round", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the round")
		}
	}

	err = h.service.RoundService.Delete(ctx, input.ID)
	if err != nil {
		h.logger.Error("failed to delete round", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while deleting the round")
	}

	resp := &shared.MessageResponse{}
	resp.Message = "Round deleted successfully"

	return resp, nil
}

func (h *httpHandler) getInvestmentsByCursor(ctx context.Context, input *shared.GetCursorPaginatedByParentPathIDInput) (*shared.GetCursorPaginatedRoundInvestmentsOutput, error) {
	limit := input.Limit + 1

	investments, err := h.service.RoundService.GetInvestmentsByCursor(ctx, input.ID, limit, input.Cursor)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("investments not found")
		default:
			h.logger.Error("failed to fetch investments", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the investments")
		}
	}

	resp := &shared.GetCursorPaginatedRoundInvestmentsOutput{}
	resp.Body.Message = "Investments fetched successfully"
	resp.Body.Investments = investments

	if len(investments) == limit {
		resp.Body.NextCursor = &investments[len(investments)-1].ID
		resp.Body.HasMore = true
		resp.Body.Investments = resp.Body.Investments[:len(resp.Body.Investments)-1]
	}

	return resp, nil
}

func (h *httpHandler) getInvestmentsByPage(ctx context.Context, input *shared.GetOffsetPaginatedByParentPathIDInput) (*shared.GetOffsetPaginatedRoundInvestmentsOutput, error) {

	investments, err := h.service.RoundService.GetInvestmentsByPage(ctx, input.ID, input.PageSize, input.Page)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("investments not found")
		default:
			h.logger.Error("failed to fetch investments", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the investments")
		}
	}

	resp := &shared.GetOffsetPaginatedRoundInvestmentsOutput{}
	resp.Body.Message = "Investments fetched successfully"
	resp.Body.Investments = investments

	if len(investments) > input.PageSize {
		resp.Body.HasMore = true
		resp.Body.Investments = resp.Body.Investments[:len(resp.Body.Investments)-1]
	}

	return resp, nil
}

func (h *httpHandler) acceptInvestment(ctx context.Context, input *shared.ParentInvestmentIDParam) (*shared.MessageResponse, error) {
	err := h.service.RoundService.AcceptInvestment(ctx, input.ID, input.InvestmentID)
	if err != nil {
		h.logger.Error("failed to accept investment", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while accepting the investment")
	}

	resp := &shared.MessageResponse{}
	resp.Message = "Investment accepted successfully"

	return resp, nil
}

func (h *httpHandler) getByCursor(ctx context.Context, input *shared.CursorPaginationRequest) (*shared.GetCursorPaginatedRoundsOutput, error) {
	limit := input.Limit + 1

	rounds, err := h.service.RoundService.GetByCursor(ctx, limit, input.Cursor)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("rounds not found")
		default:
			h.logger.Error("failed to fetch investments", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the investments")
		}
	}

	resp := &shared.GetCursorPaginatedRoundsOutput{}
	resp.Body.Message = "Rounds fetched successfully"
	resp.Body.Rounds = rounds

	if len(rounds) == limit {
		resp.Body.NextCursor = &rounds[len(rounds)-1].ID
		resp.Body.HasMore = true
		resp.Body.Rounds = resp.Body.Rounds[:len(resp.Body.Rounds)-1]
	}

	return resp, nil
}

func (h *httpHandler) getByPage(ctx context.Context, input *shared.OffsetPaginationRequest) (*shared.GetOffsetPaginatedRoundsOutput, error) {
	rounds, err := h.service.RoundService.GetByPage(ctx, input.PageSize, input.Page)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("investments not found")
		default:
			h.logger.Error("failed to fetch investments", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the investments")
		}
	}

	resp := &shared.GetOffsetPaginatedRoundsOutput{}
	resp.Body.Message = "Rounds fetched successfully"
	resp.Body.Rounds = rounds

	if len(rounds) > input.PageSize {
		resp.Body.HasMore = true
		resp.Body.Rounds = resp.Body.Rounds[:len(resp.Body.Rounds)-1]
	}

	return resp, nil
}

type SingleRoundResponse struct {
	Body struct {
		shared.MessageResponse
		Round *round.Round `json:"round"`
	}
}

func (h *httpHandler) getById(ctx context.Context, input *shared.PathIDParam) (*SingleRoundResponse, error) {
	round, err := h.service.RoundService.GetById(ctx, input.ID)
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
