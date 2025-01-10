package round

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"fundlevel/internal/entities/round"
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

type CreateRoundInput struct {
	Body round.CreateRoundParams `json:"round"`
}

func (i *CreateRoundInput) Resolve(ctx huma.Context) []error {

	if i.Body.BeginsAt.Before(time.Now()) {
		return []error{&huma.ErrorDetail{
			Message:  "begins at must be in the future",
			Location: "round.beginsAt",
			Value:    i.Body.BeginsAt,
		}}
	}

	if i.Body.EndsAt.Before(i.Body.BeginsAt) {
		return []error{&huma.ErrorDetail{
			Message:  "ends at must be after begins at",
			Location: "round.endsAt",
			Value:    i.Body.EndsAt,
		}}
	}

	return nil
}

func (h *httpHandler) create(ctx context.Context, input *CreateRoundInput) (*shared.SingleRoundResponse, error) {
	business, err := h.service.BusinessService.GetById(ctx, input.Body.BusinessID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("Business not found")
		default:
			h.logger.Error("failed to fetch business", zap.Error(err), zap.Int("business_id", input.Body.BusinessID))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the business")
		}
	}

	account := utils.GetAuthenticatedAccount(ctx)
	if account == nil {
		return nil, huma.Error401Unauthorized("You must be logged in to create a round")
	}

	authorized, err := h.service.PermissionService.CanAccountCreateRound(ctx, account.ID, input.Body.BusinessID)
	if err != nil {
		h.logger.Error("failed to check if account can create round", zap.Error(err), zap.Int("business_id", input.Body.BusinessID), zap.Int("account_id", account.ID))
		return nil, huma.Error500InternalServerError("An error occurred while checking if the account can create the round")
	}

	if !authorized {
		h.logger.Error("account does not have permission to create round", zap.Int("business_id", input.Body.BusinessID), zap.Int("account_id", account.ID))

		return nil, huma.Error403Forbidden("Account does not have permission to create round")
	}

	authorized, err = h.service.PermissionService.CanBusinessCreateRound(ctx, &business)
	if err != nil {
		h.logger.Error("failed to check if business can create round", zap.Error(err), zap.Int("business_id", input.Body.BusinessID))
		return nil, huma.Error500InternalServerError("An error occurred while checking if the business can create the round")
	}

	if !authorized {
		h.logger.Error("business does not have permission to create round", zap.Int("business_id", input.Body.BusinessID))
		return nil, huma.Error403Forbidden("Business does not have permission to create round")
	}

	round, err := h.service.RoundService.Create(ctx, input.Body)
	if err != nil {
		h.logger.Error("failed to create round", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while creating the round")
	}

	resp := &shared.SingleRoundResponse{}
	resp.Body.Message = "Round created successfully"
	resp.Body.Round = &round

	return resp, nil
}

func (h *httpHandler) delete(ctx context.Context, input *shared.PathIDParam) (*shared.MessageResponse, error) {
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

	account := utils.GetAuthenticatedAccount(ctx)
	if account == nil {
		return nil, huma.Error401Unauthorized("You must be logged in to delete a round")
	}

	authorized, err := h.service.PermissionService.CanDeleteRound(ctx, account.ID, round.Business.ID)
	if err != nil {
		h.logger.Error("failed to check if account can delete round", zap.Error(err), zap.Int("round_id", input.ID), zap.Int("account_id", account.ID))
		return nil, huma.Error500InternalServerError("An error occurred while checking if the account can delete the round")
	}

	if !authorized {
		h.logger.Error("account does not have permission to delete round", zap.Int("round_id", input.ID), zap.Int("account_id", account.ID))
		return nil, huma.Error403Forbidden("Account does not have permission to delete round")
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

type GetByCursorInput struct {
	shared.CursorPaginationRequest
}

func (h *httpHandler) getByCursor(ctx context.Context, input *GetByCursorInput) (*shared.GetCursorPaginatedRoundsOutput, error) {
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

type GetByPageInput struct {
	shared.OffsetPaginationRequest
}

func (h *httpHandler) getByPage(ctx context.Context, input *GetByPageInput) (*shared.GetOffsetPaginatedRoundsOutput, error) {
	rounds, total, err := h.service.RoundService.GetByPage(ctx, input.PageSize, input.Page)

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
	resp.Body.Total = total

	if len(rounds) > input.PageSize {
		resp.Body.HasMore = true
		resp.Body.Rounds = resp.Body.Rounds[:len(resp.Body.Rounds)-1]
	}

	return resp, nil
}

func (h *httpHandler) getById(ctx context.Context, input *shared.PathIDParam) (*shared.SingleRoundWithBusinessResponse, error) {
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

	resp := &shared.SingleRoundWithBusinessResponse{}
	resp.Body.Message = "Round fetched successfully"
	resp.Body.Round = &round

	return resp, nil
}

type RoundLikeInput struct {
	shared.PathIDParam
	AccountID int `path:"accountId"`
}
