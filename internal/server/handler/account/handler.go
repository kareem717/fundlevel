package account

import (
	"context"
	"database/sql"
	"errors"

	"fundlevel/internal/entities/account"
	"fundlevel/internal/entities/business"
	"fundlevel/internal/entities/investment"
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

func (h *httpHandler) getInvestmentsByCursor(ctx context.Context, input *shared.GetCursorPaginatedByParentPathIDInput) (*shared.GetCursorPaginatedRoundInvestmentsOutput, error) {
	limit := input.Limit + 1

	investments, err := h.service.AccountService.GetInvestmentsByCursor(ctx, input.ID, limit, input.Cursor)

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
	investments, err := h.service.AccountService.GetInvestmentsByPage(ctx, input.ID, input.PageSize, input.Page)

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

func (h *httpHandler) withdrawInvestment(ctx context.Context, input *shared.ParentInvestmentIDParam) (*shared.MessageResponse, error) {
	err := h.service.AccountService.WithdrawInvestment(ctx, input.ID, input.InvestmentID)
	if err != nil {
		h.logger.Error("failed to withdraw investment", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while withdrawing the investment")
	}

	resp := &shared.MessageResponse{}
	resp.Message = "Investment withdrawn successfully"

	return resp, nil
}

func (h *httpHandler) deleteInvestment(ctx context.Context, input *shared.ParentInvestmentIDParam) (*shared.MessageResponse, error) {
	err := h.service.AccountService.DeleteInvestment(ctx, input.ID, input.InvestmentID)
	if err != nil {
		h.logger.Error("failed to delete investment", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while deleting the investment")
	}

	resp := &shared.MessageResponse{}
	resp.Message = "Investment deleted successfully"

	return resp, nil
}

type CreateInvestmentInput struct {
	Body investment.CreateInvestmentParams `json:"investment"`
}

func (h *httpHandler) createInvestment(ctx context.Context, input *CreateInvestmentInput) (*shared.SingleInvestmentResponse, error) {
	investment, err := h.service.AccountService.CreateInvestment(ctx, input.Body)
	if err != nil {
		h.logger.Error("failed to create investment", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while creating the investment")
	}

	resp := &shared.SingleInvestmentResponse{}
	resp.Body.Message = "Investment created successfully"
	resp.Body.Investment = &investment

	return resp, nil
}

type GetBusinessesOutput struct {
	Body struct {
		shared.MessageResponse
		Businesses []business.Business `json:"businesses"`
	}
}

func (h *httpHandler) getAllBusinesses(ctx context.Context, input *shared.PathIDParam) (*GetBusinessesOutput, error) {
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

type GetStripeCheckoutLinkInput struct {
	shared.PathIDParam
	InvestmentID int    `path:"investmentId"`
	RedirectURL  string `query:"redirectUrl" required:"true" format:"url"`
}

type LinkOutput struct {
	Body struct {
		Message string `json:"message"`
		Link    string `json:"link"`
	}
}

func (h *httpHandler) getInvestmentCheckoutLink(ctx context.Context, input *GetStripeCheckoutLinkInput) (*LinkOutput, error) {
	investment, err := h.service.AccountService.GetInvestmentById(ctx, input.ID, input.InvestmentID)
	if err != nil {
		h.logger.Error("failed to get investment", zap.Error(err))
		return nil, huma.Error500InternalServerError("Failed to get investment")
	}

	round, err := h.service.RoundService.GetById(ctx, investment.RoundID)
	if err != nil {
		h.logger.Error("failed to get round", zap.Error(err))
		return nil, huma.Error500InternalServerError("Failed to get round")
	}

	checkoutPrice := int(round.BuyIn * 100)
	sess, err := h.service.BillingService.CreateInvestmentCheckoutSession(ctx, checkoutPrice, input.RedirectURL, input.RedirectURL, investment.ID)
	if err != nil {
		h.logger.Error("failed to create stripe checkout session", zap.Error(err))
		return nil, huma.Error500InternalServerError("Failed to create stripe checkout session")
	}

	resp := &LinkOutput{}
	resp.Body.Message = "Stripe checkout link created successfully"
	resp.Body.Link = sess

	return resp, nil
}
