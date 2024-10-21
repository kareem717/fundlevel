package account

import (
	"context"
	"database/sql"
	"errors"

	"fundlevel/internal/entities/account"
	"fundlevel/internal/entities/business"
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
		h.logger.Error(
			"input user id does not match authenticated user id",
			zap.Any("input user id", input.Body.UserID),
			zap.Any("authenticated user id", user.ID),
		)

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

func (h *httpHandler) getInvestmentsByCursor(ctx context.Context, input *shared.GetInvestmentsByParentAndCursorInput) (*shared.GetCursorPaginatedRoundInvestmentsOutput, error) {
	if account := shared.GetAuthenticatedAccount(ctx); account.ID != input.ID {
		h.logger.Error(
			"input account id does not match authenticated account id",
			zap.Any("input account id", input.ID),
			zap.Any("authenticated account id", account.ID),
		)

		return nil, huma.Error403Forbidden("Cannot get investments for another account")
	}

	limit := input.Limit + 1

	investments, err := h.service.AccountService.GetInvestmentsByCursor(ctx, input.ID, limit, input.Cursor, input.InvestmentFilter)

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

func (h *httpHandler) getInvestmentsByPage(ctx context.Context, input *shared.GetInvestmentsByParentAndPageInput) (*shared.GetOffsetPaginatedRoundInvestmentsOutput, error) {
	if account := shared.GetAuthenticatedAccount(ctx); account.ID != input.ID {
		h.logger.Error("input account id does not match authenticated account id",
			zap.Any("input account id", input.ID),
			zap.Any("authenticated account id", account.ID))

		return nil, huma.Error403Forbidden("Cannot get investments for another account")
	}

	investments, total, err := h.service.AccountService.GetInvestmentsByPage(ctx, input.ID, input.PageSize, input.Page, input.InvestmentFilter)

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
	resp.Body.Total = total
	if len(investments) > input.PageSize {
		resp.Body.HasMore = true
		resp.Body.Investments = resp.Body.Investments[:len(resp.Body.Investments)-1]
	}

	return resp, nil
}

type GetBusinessesOutput struct {
	Body struct {
		shared.MessageResponse
		Businesses []business.Business `json:"businesses"`
	}
}

func (h *httpHandler) getAllBusinesses(ctx context.Context, input *shared.PathIDParam) (*GetBusinessesOutput, error) {
	if account := shared.GetAuthenticatedAccount(ctx); account.ID != input.ID {
		h.logger.Error("input account id does not match authenticated account id",
			zap.Any("input account id", input.ID),
			zap.Any("authenticated account id", account.ID))

		return nil, huma.Error403Forbidden("Cannot get businesses for another account")
	}

	businesses, err := h.service.AccountService.GetAllBusinesses(ctx, input.ID)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("businesses not found")
		default:
			h.logger.Error("failed to fetch businesses", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the ventures")
		}
	}

	resp := &GetBusinessesOutput{}
	resp.Body.Message = "Businesses fetched successfully"
	resp.Body.Businesses = businesses

	return resp, nil
}


func (h *httpHandler) getInvestmentById(ctx context.Context, input *shared.PathIDParam) (*shared.SingleInvestmentResponse, error) {
	account := shared.GetAuthenticatedAccount(ctx)

	if account.ID != input.ID {
		h.logger.Error("input account id does not match authenticated account id",
			zap.Any("input account id", input.ID),
			zap.Any("authenticated account id", account.ID))

		return nil, huma.Error403Forbidden("Cannot fetch investment for another account")
	}

	investment, err := h.service.InvestmentService.GetById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("Investment not found")
		default:
			h.logger.Error("failed to fetch investment", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the investment")
		}
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
