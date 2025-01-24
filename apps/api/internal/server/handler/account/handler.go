package account

import (
	"context"
	"database/sql"
	"errors"

	"fundlevel/internal/entities/account"
	"fundlevel/internal/entities/business"
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

func (h *httpHandler) getByUserId(ctx context.Context, input *struct{}) (*shared.SingleAccountResponse, error) {
	user := utils.GetAuthenticatedUser(ctx)
	if user == nil {
		return nil, huma.Error401Unauthorized("Unauthorized")
	}

	account, err := h.service.AccountService.GetByUserId(ctx, user.ID)
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

func (h *httpHandler) create(ctx context.Context, input *CreateAccountInput) (*struct{}, error) {
	user := utils.GetAuthenticatedUser(ctx)
	if user == nil {
		return nil, huma.Error401Unauthorized("Unauthorized")
	}

	_, err := h.service.AccountService.Create(ctx, input.Body, user.ID)
	if err != nil {
		h.logger.Error("failed to create account", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while creating the account")
	}

	return &struct{}{}, nil
}

type UpdateAccountInput struct {
	Body account.UpdateAccountParams `json:"account"`
}

func (h *httpHandler) update(ctx context.Context, input *UpdateAccountInput) (*struct{}, error) {
	account := utils.GetAuthenticatedAccount(ctx)
	if account == nil {
		return nil, huma.Error401Unauthorized("Unauthorized")
	}

	_, err := h.service.AccountService.Update(ctx, account.ID, input.Body)
	if err != nil {
		h.logger.Error("failed to update account", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while updating the account")
	}

	// TODO: Do we have to return anything?
	return &struct{}{}, nil
}

func (h *httpHandler) delete(ctx context.Context, input *struct{}) (*struct{}, error) {
	account := utils.GetAuthenticatedAccount(ctx)
	if account == nil {
		return nil, huma.Error401Unauthorized("Unauthorized")
	}

	err := h.service.AccountService.Delete(ctx, account.ID)
	if err != nil {
		h.logger.Error("failed to delete account", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while deleting the account")
	}

	return &struct{}{}, nil
}

type GetBusinessesOutput struct {
	Body struct {
		shared.MessageResponse
		Businesses []business.Business `json:"businesses"`
	}
}

func (h *httpHandler) getAllBusinesses(ctx context.Context, input *struct{}) (*GetBusinessesOutput, error) {
	account := utils.GetAuthenticatedAccount(ctx)
	if account == nil {
		return nil, huma.Error401Unauthorized("Unauthorized")
	}

	businesses, err := h.service.AccountService.GetAllBusinesses(ctx, account.ID)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("businesses not found")
		default:
			h.logger.Error("failed to fetch businesses", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the businesses")
		}
	}

	resp := &GetBusinessesOutput{}
	resp.Body.Message = "Businesses fetched successfully"
	resp.Body.Businesses = businesses

	return resp, nil
}

type GetStripeIdentityVerificationSessionURLInput struct {
	ReturnURL string `query:"returnURL" default:"https://fundlevel.app"`
}

func (h *httpHandler) getStripeIdentityVerificationSessionURL(ctx context.Context, input *GetStripeIdentityVerificationSessionURLInput) (*shared.URLOutput, error) {
	account := utils.GetAuthenticatedAccount(ctx)
	if account == nil {
		return nil, huma.Error401Unauthorized("Unauthorized")
	}

	url, err := h.service.AccountService.GetStripeIdentityVerificationSessionURL(ctx, account.ID, input.ReturnURL)
	if err != nil {
		h.logger.Error("failed to get stripe identity verification session url", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while getting the stripe identity verification session url")
	}

	resp := &shared.URLOutput{}
	resp.Body.Message = "Stripe identity verification session url fetched successfully"
	resp.Body.URL = url

	return resp, nil
}
