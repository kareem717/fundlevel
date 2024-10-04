package account

import (
	"context"
	"database/sql"
	"errors"

	"fundlevel/internal/entities/account"
	"fundlevel/internal/entities/investment"
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

func (h *httpHandler) getByID(ctx context.Context, input *shared.PathIDParam) (*shared.SingleAccountResponse, error) {
	if account := shared.GetAuthenticatedAccount(ctx); account.ID != input.ID {
		h.logger.Error("input account id does not match authenticated account id",
			zap.Any("input account id", input.ID),
			zap.Any("authenticated account id", account.ID))

		return nil, huma.Error403Forbidden("Cannot get account for another user")
	}

	account, err := h.service.AccountService.GetById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("Account not found")
		default:
			h.logger.Error("failed to fetch account", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the account")
		}
	}

	resp := &shared.SingleAccountResponse{}
	resp.Body.Message = "Account fetched successfully"
	resp.Body.Account = &account

	return resp, nil
}

type CreateAccountInput struct {
	Body account.CreateAccountParams `json:"account"`
}

func (h *httpHandler) create(ctx context.Context, input *CreateAccountInput) (*shared.SingleAccountResponse, error) {
	if user := shared.GetAuthenticatedUser(ctx); user.ID != input.Body.UserID {
		h.logger.Error("input user id does not match authenticated user id",
			zap.Any("input user id", input.Body.UserID),
			zap.Any("authenticated user id", user.ID))

		return nil, huma.Error403Forbidden("Cannot create account for another user")
	}

	account, err := h.service.AccountService.Create(ctx, input.Body)
	if err != nil {
		h.logger.Error("failed to create account", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while creating the account")
	}

	resp := &shared.SingleAccountResponse{}
	resp.Body.Message = "Account created successfully"
	resp.Body.Account = &account

	return resp, nil
}

type UpdateAccountInput struct {
	shared.PathIDParam
	Body account.UpdateAccountParams `json:"account"`
}

func (h *httpHandler) update(ctx context.Context, input *UpdateAccountInput) (*shared.SingleAccountResponse, error) {
	if account := shared.GetAuthenticatedAccount(ctx); account.ID != input.ID {
		h.logger.Error("input account id does not match authenticated account id",
			zap.Any("input account id", input.ID),
			zap.Any("authenticated account id", account.ID))

		return nil, huma.Error403Forbidden("Cannot update account for another user")
	}

	_, err := h.service.AccountService.GetById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("Account not found")
		default:
			h.logger.Error("failed to fetch account", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the account")
		}
	}

	account, err := h.service.AccountService.Update(ctx, input.ID, input.Body)

	if err != nil {
		h.logger.Error("failed to update account", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while updating the account")
	}

	resp := &shared.SingleAccountResponse{}
	resp.Body.Message = "Account updated successfully"
	resp.Body.Account = &account

	return resp, nil
}

type DeleteAccountResponse struct {
	Body shared.MessageResponse
}

func (h *httpHandler) delete(ctx context.Context, input *shared.PathIDParam) (*DeleteAccountResponse, error) {
	if account := shared.GetAuthenticatedAccount(ctx); account.ID != input.ID {
		h.logger.Error("input account id does not match authenticated account id",
			zap.Any("input account id", input.ID),
			zap.Any("authenticated account id", account.ID))

		return nil, huma.Error403Forbidden("Cannot delete account for another user")
	}

	_, err := h.service.AccountService.GetById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("Account not found")
		default:
			h.logger.Error("failed to fetch account", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the account")
		}
	}

	err = h.service.AccountService.Delete(ctx, input.ID)
	if err != nil {
		h.logger.Error("failed to delete account", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while deleting the account")
	}

	resp := &DeleteAccountResponse{}
	resp.Body.Message = "Account deleted successfully"

	return resp, nil
}

func (h *httpHandler) getCursorPaginatedVentures(ctx context.Context, input *shared.GetCursorPaginatedByParentPathIDInput) (*shared.GetCursorPaginatedVenturesOutput, error) {
	limit := input.Limit + 1

	ventures, err := h.service.AccountService.GetVenturesByCursor(ctx, input.ID, limit, input.Cursor)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("ventures not found")
		default:
			h.logger.Error("failed to fetch ventures", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the ventures")
		}
	}

	resp := &shared.GetCursorPaginatedVenturesOutput{}
	resp.Body.Message = "Ventures fetched successfully"
	resp.Body.Ventures = ventures

	if len(ventures) == limit {
		resp.Body.NextCursor = &ventures[len(ventures)-1].ID
		resp.Body.HasMore = true
		resp.Body.Ventures = resp.Body.Ventures[:len(resp.Body.Ventures)-1]
	}

	return resp, nil
}

func (h *httpHandler) getOffsetPaginatedVentures(ctx context.Context, input *shared.GetOffsetPaginatedByParentPathIDInput) (*shared.GetOffsetPaginatedVenturesOutput, error) {
	pageSize := input.PageSize + 1

	ventures, err := h.service.AccountService.GetVenturesByPage(ctx, input.ID, pageSize, input.Page)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("ventures not found")
		default:
			h.logger.Error("failed to fetch ventures", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the ventures")
		}
	}

	resp := &shared.GetOffsetPaginatedVenturesOutput{}
	resp.Body.Message = "Ventures fetched successfully"
	resp.Body.Ventures = ventures

	if len(ventures) == pageSize {
		resp.Body.HasMore = true
		resp.Body.Ventures = resp.Body.Ventures[:len(resp.Body.Ventures)-1]
	}

	return resp, nil
}

func (h *httpHandler) getCursorPaginatedRoundInvestments(ctx context.Context, input *shared.GetCursorPaginatedByParentPathIDInput) (*shared.GetCursorPaginatedRoundInvestmentsOutput, error) {
	limit := input.Limit + 1

	investments, err := h.service.AccountService.GetRoundInvestmentsByCursor(ctx, input.ID, limit, input.Cursor)

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

func (h *httpHandler) getOffsetPaginatedRoundInvestments(ctx context.Context, input *shared.GetOffsetPaginatedByParentPathIDInput) (*shared.GetOffsetPaginatedRoundInvestmentsOutput, error) {
	pageSize := input.PageSize + 1

	investments, err := h.service.AccountService.GetRoundInvestmentsByPage(ctx, input.ID, pageSize, input.Page)

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

	if len(investments) == pageSize {
		resp.Body.HasMore = true
		resp.Body.Investments = resp.Body.Investments[:len(resp.Body.Investments)-1]
	}

	return resp, nil
}

func (h *httpHandler) withdrawRoundInvestment(ctx context.Context, input *shared.ParentInvestmentIDParam) (*shared.MessageResponse, error) {
	err := h.service.AccountService.WithdrawRoundInvestment(ctx, input.ID, input.InvestmentID)
	if err != nil {
		h.logger.Error("failed to withdraw investment", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while withdrawing the investment")
	}

	resp := &shared.MessageResponse{}
	resp.Message = "Investment withdrawn successfully"

	return resp, nil
}

func (h *httpHandler) deleteRoundInvestment(ctx context.Context, input *shared.ParentInvestmentIDParam) (*shared.MessageResponse, error) {
	err := h.service.AccountService.DeleteRoundInvestment(ctx, input.ID, input.InvestmentID)
	if err != nil {
		h.logger.Error("failed to delete investment", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while deleting the investment")
	}

	resp := &shared.MessageResponse{}
	resp.Message = "Investment deleted successfully"

	return resp, nil
}

type CreateRoundInvestmentInput struct {
	Body investment.CreateInvestmentParams `json:"investment"`
}

type SingleRoundInvestmentResponse struct {
	Body struct {
		shared.MessageResponse
		Investment *investment.RoundInvestment `json:"investment"`
	}
}

func (h *httpHandler) createRoundInvestment(ctx context.Context, input *CreateRoundInvestmentInput) (*SingleRoundInvestmentResponse, error) {
	investment, err := h.service.AccountService.CreateRoundInvestment(ctx, input.Body)
	if err != nil {
		h.logger.Error("failed to create investment", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while creating the investment")
	}

	resp := &SingleRoundInvestmentResponse{}
	resp.Body.Message = "Investment created successfully"
	resp.Body.Investment = &investment

	return resp, nil
}

type GetRoundsByFilterAndCursorInput struct {
	shared.PathIDParam
	shared.CursorPaginationRequest
	round.RoundFilter
}

func (h *httpHandler) getRoundsByFilterAndCursor(ctx context.Context, input *GetRoundsByFilterAndCursorInput) (*shared.GetCursorPaginatedRoundsWithSubtypesOutput, error) {
	limit := input.Limit + 1

	rounds, err := h.service.AccountService.GetRoundsByFilterAndCursor(ctx, input.ID, input.RoundFilter, limit, input.Cursor)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("rounds not found")
		default:
			h.logger.Error("failed to fetch rounds", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the rounds")
		}
	}

	resp := &shared.GetCursorPaginatedRoundsWithSubtypesOutput{}
	resp.Body.Message = "Rounds fetched successfully"
	resp.Body.RoundWithSubtypes = rounds

	if len(rounds) == limit {
		resp.Body.NextCursor = &rounds[len(rounds)-1].ID
		resp.Body.HasMore = true
		resp.Body.RoundWithSubtypes = resp.Body.RoundWithSubtypes[:len(resp.Body.RoundWithSubtypes)-1]
	}

	return resp, nil
}