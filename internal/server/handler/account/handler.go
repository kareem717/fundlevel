package account

import (
	"context"
	"database/sql"
	"errors"

	"fundlevel/internal/entities/account"
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

type SingleAccountResponse struct {
	Body struct {
		shared.MessageResponse
		Account *account.Account `json:"account"`
	}
}

func (h *httpHandler) getByID(ctx context.Context, input *shared.PathIDParam) (*SingleAccountResponse, error) {
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

	resp := &SingleAccountResponse{}
	resp.Body.Message = "Account fetched successfully"
	resp.Body.Account = &account

	return resp, nil
}

func (h *httpHandler) getByUserId(ctx context.Context, input *shared.PathUserIDParam) (*SingleAccountResponse, error) {
	if user := shared.GetAuthenticatedUser(ctx); user.ID != input.UserID {
		h.logger.Error("input user id does not match authenticated user id",
			zap.Any("input user id", input.UserID),
			zap.Any("authenticated user id", user.ID))

		return nil, huma.Error403Forbidden("Cannot get account for another user")
	}

	h.logger.Info("getting account by user id", zap.Any("user id", input.UserID))
	account, err := h.service.AccountService.GetByUserId(ctx, input.UserID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("Account not found")
		default:
			h.logger.Error("failed to fetch account", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the account")
		}
	}

	resp := &SingleAccountResponse{}
	resp.Body.Message = "Account fetched successfully"
	resp.Body.Account = &account

	return resp, nil
}

type CreateAccountInput struct {
	Body account.CreateAccountParams `json:"account"`
}

func (h *httpHandler) create(ctx context.Context, input *CreateAccountInput) (*SingleAccountResponse, error) {
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

	resp := &SingleAccountResponse{}
	resp.Body.Message = "Account created successfully"
	resp.Body.Account = &account

	return resp, nil
}

type UpdateAccountInput struct {
	shared.PathIDParam
	Body account.UpdateAccountParams `json:"account"`
}

func (h *httpHandler) update(ctx context.Context, input *UpdateAccountInput) (*SingleAccountResponse, error) {
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

	resp := &SingleAccountResponse{}
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
