package user

import (
	"context"
	"database/sql"
	"errors"

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

func (h *httpHandler) getAccout(ctx context.Context, input *shared.PathUserIDParam) (*shared.SingleAccountResponse, error) {
	if user := shared.GetAuthenticatedUser(ctx); user.ID != input.UserID {
		h.logger.Error("input user id does not match authenticated user id",
			zap.Any("input user id", input.UserID),
			zap.Any("authenticated user id", user.ID))

		return nil, huma.Error403Forbidden("Cannot get account for another user")
	}

	h.logger.Info("getting account by user id", zap.Any("user id", input.UserID))
	account, err := h.service.UserService.GetAccount(ctx, input.UserID)
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
