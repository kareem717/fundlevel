package investment

import (
	"context"
	"database/sql"
	"errors"
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

func (h *httpHandler) acceptInvestment(ctx context.Context, input *shared.PathIDParam) (*shared.MessageResponse, error) {
	investmentResult, err := h.service.InvestmentService.GetById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("investment not found")
		default:
			h.logger.Error("failed to fetch investment", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the investment")
		}
	}

	if investmentResult.Status != investment.InvestmentStatusPending {
		return nil, huma.Error400BadRequest("Investment is not pending")
	}

	round, err := h.service.RoundService.GetById(ctx, investmentResult.RoundID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("round not found")
		default:
			h.logger.Error("failed to fetch round", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the round")
		}
	}

	if account := shared.GetAuthenticatedAccount(ctx); account.ID != round.Venture.Business.OwnerAccountID {
		h.logger.Error("business owner account id does not match authenticated account id",
			zap.Any("business owner account id", round.Venture.Business.OwnerAccountID),
			zap.Any("authenticated account id", account.ID))

		return nil, huma.Error403Forbidden("Cannot accept investment for a round for a business you do not own")
	}

	err = h.service.InvestmentService.AcceptInvestment(ctx, input.ID)
	if err != nil {
		h.logger.Error("failed to accept investment", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while accepting the investment")
	}

	resp := &shared.MessageResponse{}
	resp.Message = "Investment accepted successfully"

	return resp, nil
}

func (h *httpHandler) withdrawInvestment(ctx context.Context, input *shared.PathIDParam) (*shared.MessageResponse, error) {
	investmentResult, err := h.service.InvestmentService.GetById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("investment not found")
		default:
			h.logger.Error("failed to fetch investment", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the investment")
		}
	}

	if account := shared.GetAuthenticatedAccount(ctx); account.ID != investmentResult.InvestorID {
		h.logger.Error("input account id does not match authenticated account id",
			zap.Any("input account id", input.ID),
			zap.Any("authenticated account id", account.ID))

		return nil, huma.Error403Forbidden("Cannot withdraw investment for another account")
	}

	if investmentResult.Status != investment.InvestmentStatusPending {
		return nil, huma.Error400BadRequest("Investment is not pending")
	}

	err = h.service.InvestmentService.WithdrawInvestment(ctx, input.ID)
	if err != nil {
		h.logger.Error("failed to withdraw investment", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while withdrawing the investment")
	}

	resp := &shared.MessageResponse{}
	resp.Message = "Investment withdrawn successfully"

	return resp, nil
}

func (h *httpHandler) deleteInvestment(ctx context.Context, input *shared.PathIDParam) (*shared.MessageResponse, error) {
	investment, err := h.service.InvestmentService.GetById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("investment not found")
		default:
			h.logger.Error("failed to fetch investment", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the investment")
		}
	}

	if account := shared.GetAuthenticatedAccount(ctx); account.ID != investment.InvestorID {
		h.logger.Error("input account id does not match authenticated account id",
			zap.Any("input account id", input.ID),
			zap.Any("authenticated account id", account.ID))

		return nil, huma.Error403Forbidden("Cannot delete investment for another account")
	}

	err = h.service.InvestmentService.DeleteInvestment(ctx, input.ID)
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
	if account := shared.GetAuthenticatedAccount(ctx); account.ID != input.Body.InvestorID {
		h.logger.Error("input account id does not match authenticated account id",
			zap.Any("input account id", input.Body.InvestorID),
			zap.Any("authenticated account id", account.ID))

		return nil, huma.Error403Forbidden("Cannot create investment for another account")
	}

	investment, err := h.service.InvestmentService.CreateInvestment(ctx, input.Body)
	if err != nil {
		h.logger.Error("failed to create investment", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while creating the investment")
	}

	resp := &shared.SingleInvestmentResponse{}
	resp.Body.Message = "Investment created successfully"
	resp.Body.Investment = &investment

	return resp, nil
}

type GetStripeCheckoutLinkInput struct {
	shared.PathIDParam
	RedirectURL string `query:"redirectUrl" required:"true" format:"url"`
}

type LinkOutput struct {
	Body struct {
		Message string `json:"message"`
		Link    string `json:"link"`
	}
}

func (h *httpHandler) getInvestmentCheckoutLink(ctx context.Context, input *GetStripeCheckoutLinkInput) (*LinkOutput, error) {
	investmentRecord, err := h.service.InvestmentService.GetById(ctx, input.ID)
	if err != nil {
		h.logger.Error("failed to get investment", zap.Error(err))
		return nil, huma.Error500InternalServerError("Failed to get investment")
	}

	if investmentRecord.Status != investment.InvestmentStatusPending {
		return nil, huma.Error400BadRequest("Investment is not pending")
	}

	if account := shared.GetAuthenticatedAccount(ctx); account.ID != investmentRecord.InvestorID {
		h.logger.Error("input account id does not match authenticated account id",
			zap.Any("input account id", investmentRecord.InvestorID),
			zap.Any("authenticated account id", account.ID))

		return nil, huma.Error403Forbidden("Cannot get investment checkout link for a investment you did not make")
	}

	round, err := h.service.RoundService.GetById(ctx, investmentRecord.RoundID)
	if err != nil {
		h.logger.Error("failed to get round", zap.Error(err))
		return nil, huma.Error500InternalServerError("Failed to get round")
	}

	checkoutPrice := int(round.BuyIn * 100)
	sess, err := h.service.BillingService.CreateInvestmentCheckoutSession(ctx, checkoutPrice, input.RedirectURL, input.RedirectURL, investmentRecord.ID, round.ValueCurrency)
	if err != nil {
		h.logger.Error("failed to create stripe checkout session", zap.Error(err))
		return nil, huma.Error500InternalServerError("Failed to create stripe checkout session")
	}

	resp := &LinkOutput{}
	resp.Body.Message = "Stripe checkout link created successfully"
	resp.Body.Link = sess

	return resp, nil
}
