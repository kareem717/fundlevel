package business

import (
	"context"
	"database/sql"
	"errors"

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

func (h *httpHandler) getByID(ctx context.Context, input *shared.PathIDParam) (*shared.SingleBusinessResponse, error) {
	business, err := h.service.BusinessService.GetById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("Business not found")
		default:
			h.logger.Error("failed to fetch business", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the account")
		}
	}

	resp := &shared.SingleBusinessResponse{}
	resp.Body.Message = "Business fetched successfully"
	resp.Body.Business = &business

	return resp, nil
}

type CreateBusinessRequest struct {
	Body business.CreateBusinessParams `json:"business"`
}

func (h *httpHandler) create(ctx context.Context, input *CreateBusinessRequest) (*shared.MessageOutput, error) {
	account := shared.GetAuthenticatedAccount(ctx)

	authorized, err := h.service.PermissionService.CanCreateBusiness(ctx, account)
	if err != nil {
		h.logger.Error("failed to check if account can create business", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while checking authorization")
	}

	if !authorized {
		h.logger.Error("account is not authorized to create business",
			zap.Any("account id", account.ID))

		return nil, huma.Error403Forbidden("Account is not authorized to create business")
	}

	err = h.service.BusinessService.Create(ctx, input.Body)
	if err != nil {
		h.logger.Error("failed to create business", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while creating the business")
	}

	resp := &shared.MessageOutput{}
	resp.Body.Message = "Business created successfully"

	return resp, nil
}

type DeleteBusinessOutput struct {
	Body shared.MessageResponse
}

func (h *httpHandler) delete(ctx context.Context, input *shared.PathIDParam) (*DeleteBusinessOutput, error) {
	business, err := h.service.BusinessService.GetById(ctx, input.ID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, huma.Error404NotFound("Business not found")
		}

		h.logger.Error("failed to fetch business", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while fetching the business")
	}

	account := shared.GetAuthenticatedAccount(ctx)

	canDelete, err := h.service.PermissionService.CanAccountDeleteBusiness(ctx, account.ID, business.ID)
	if err != nil {
		h.logger.Error("failed to check if account can delete business", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while checking authorization")
	}

	if !canDelete {
		h.logger.Error("account is not authorized to delete this business",
			zap.Any("account id", account.ID),
			zap.Any("business id", business.ID))

		return nil, huma.Error403Forbidden("Account is not authorized to delete this business")
	}

	err = h.service.BusinessService.Delete(ctx, business.ID)
	if err != nil {
		h.logger.Error("failed to delete business", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while deleting the business")
	}

	resp := &DeleteBusinessOutput{}
	resp.Body.Message = "Business deleted successfully"

	return resp, nil
}

func (h *httpHandler) getRoundsByCursor(ctx context.Context, input *shared.GetRoundsByParentAndCursorInput) (*shared.GetCursorPaginatedRoundsOutput, error) {
	limit := input.Limit + 1

	rounds, err := h.service.BusinessService.GetRoundsByCursor(ctx, input.ID, limit, input.Cursor, input.RoundFilter)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("rounds not found")
		default:
			h.logger.Error("failed to fetch rounds", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the rounds")
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

func (h *httpHandler) getRoundsByPage(ctx context.Context, input *shared.GetRoundsByParentAndPageInput) (*shared.GetOffsetPaginatedRoundsOutput, error) {
	rounds, total, err := h.service.BusinessService.GetRoundsByPage(ctx, input.ID, input.PageSize, input.Page, input.RoundFilter)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("rounds not found")
		default:
			h.logger.Error("failed to fetch rounds", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the rounds")
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

func (h *httpHandler) getInvestmentsByCursor(ctx context.Context, input *shared.GetInvestmentsByParentAndCursorInput) (*shared.GetCursorPaginatedRoundInvestmentsOutput, error) {
	business, err := h.service.BusinessService.GetById(ctx, input.ID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, huma.Error404NotFound("Business not found")
		}

		h.logger.Error("failed to fetch business", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while fetching the business")
	}

	account := shared.GetAuthenticatedAccount(ctx)

	authorized, err := h.service.PermissionService.CanAccessBusinessInvestments(ctx, account.ID, business.ID)
	if err != nil {
		h.logger.Error("failed to check if account can access business investments", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while checking authorization")
	}

	if !authorized {
		h.logger.Error("account is not authorized to access business investments",
			zap.Any("account id", account.ID),
			zap.Any("business id", business.ID))

		return nil, huma.Error403Forbidden("Account is not authorized to access business investments")
	}

	limit := input.Limit + 1

	investments, err := h.service.BusinessService.GetInvestmentsByCursor(ctx, input.ID, limit, input.Cursor, input.InvestmentFilter)

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
	business, err := h.service.BusinessService.GetById(ctx, input.ID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, huma.Error404NotFound("Business not found")
		}

		h.logger.Error("failed to fetch business", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while fetching the business")
	}

	account := shared.GetAuthenticatedAccount(ctx)
	authorized, err := h.service.PermissionService.CanAccessBusinessInvestments(ctx, account.ID, business.ID)
	if err != nil {
		h.logger.Error("failed to check if account can access business investments", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while checking authorization")
	}

	if !authorized {
		h.logger.Error("account is not authorized to access business investments",
			zap.Any("account id", account.ID),
			zap.Any("business id", business.ID))

		return nil, huma.Error403Forbidden("Account is not authorized to access business investments")
	}

	investments, total, err := h.service.BusinessService.GetInvestmentsByPage(ctx, input.ID, input.PageSize, input.Page, input.InvestmentFilter)

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

func (h *httpHandler) getTotalFunding(ctx context.Context, input *shared.PathIDParam) (*shared.FundingOutput, error) {
	totalFunding, err := h.service.BusinessService.GetTotalFunding(ctx, input.ID)
	if err != nil {
		h.logger.Error("failed to fetch total funding", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while fetching the total funding")
	}

	resp := &shared.FundingOutput{}
	resp.Body.Message = "Total funding fetched successfully"
	resp.Body.TotalFunding = totalFunding

	return resp, nil
}

type OnboardStripeConnectedAccountInput struct {
	shared.PathIDParam
	Body struct {
		ReturnURL  string `json:"returnURL"`
		RefreshURL string `json:"refreshURL"`
	} `json:"body"`
}

func (h *httpHandler) onboardStripeConnectedAccount(ctx context.Context, input *OnboardStripeConnectedAccountInput) (*shared.URLOutput, error) {
	business, err := h.service.BusinessService.GetById(ctx, input.ID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, huma.Error404NotFound("Business not found")
		}

		h.logger.Error("failed to fetch business", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while fetching the business")
	}

	account := shared.GetAuthenticatedAccount(ctx)

	authorized, err := h.service.PermissionService.CanManageBusinessStripe(ctx, account.ID, business.ID)
	if err != nil {
		h.logger.Error("failed to check if account can onboard stripe connected account", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while checking authorization")
	}

	if !authorized {
		h.logger.Error("account is not authorized to onboard stripe connected account",
			zap.Any("account id", account.ID),
			zap.Any("business id", business.ID))

		return nil, huma.Error403Forbidden("Account is not authorized to onboard stripe connected account")
	}

	link, err := h.service.BusinessService.CreateStripeAccountLink(ctx, business.StripeAccount.StripeConnectedAccountID, input.Body.ReturnURL, input.Body.RefreshURL)
	if err != nil {
		return nil, huma.Error500InternalServerError("An error occurred while creating the account link")
	}

	resp := &shared.URLOutput{}
	resp.Body.Message = "Account link created successfully"
	resp.Body.URL = link

	return resp, nil
}

func (h *httpHandler) getStripeDashboardURL(ctx context.Context, input *shared.PathIDParam) (*shared.URLOutput, error) {
	account := shared.GetAuthenticatedAccount(ctx)

	business, err := h.service.BusinessService.GetById(ctx, input.ID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, huma.Error404NotFound("Business not found")
		}

		h.logger.Error("failed to fetch business", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while fetching the business")
	}

	authorized, err := h.service.PermissionService.CanAccessBusinessStripeDashboard(ctx, account.ID, business.ID)
	if err != nil {
		h.logger.Error("failed to check if account can access business stripe dashboard", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while checking authorization")
	}

	if !authorized {
		h.logger.Error("account is not authorized to access business stripe dashboard",
			zap.Any("account id", account.ID),
			zap.Any("business id", business.ID))

		return nil, huma.Error403Forbidden("Account is not authorized to access business stripe dashboard")
	}

	url, err := h.service.BusinessService.GetStripeDashboardURL(ctx, input.ID)
	if err != nil {
		return nil, huma.Error500InternalServerError("An error occurred while fetching the stripe dashboard url")
	}

	resp := &shared.URLOutput{}
	resp.Body.Message = "Stripe dashboard url fetched successfully"
	resp.Body.URL = url

	return resp, nil

}

type GetOffsetPaginatedBusinessMembersOutput struct {
	Body struct {
		shared.MessageResponse
		Members []business.BusinessMemberWithRoleNameAndAccount `json:"members"`
		shared.OffsetPaginationResponse
	} `json:"body"`
}

func (h *httpHandler) getMembersByPage(ctx context.Context, input *shared.GetOffsetPaginatedByParentPathIDInput) (*GetOffsetPaginatedBusinessMembersOutput, error) {
	account := shared.GetAuthenticatedAccount(ctx)
	authorized, err := h.service.PermissionService.CanViewBusinessMembers(ctx, account.ID, input.ID)
	if err != nil {
		h.logger.Error("failed to check if account can view business members", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while checking authorization")
	}

	if !authorized {
		h.logger.Error("account is not authorized to view business members",
			zap.Any("account id", account.ID),
			zap.Any("business id", input.ID))

		return nil, huma.Error403Forbidden("Account is not authorized to view business members")
	}

	members, total, err := h.service.BusinessService.GetMembersByPage(ctx, input.ID, input.PageSize, input.Page)
	if err != nil {
		h.logger.Error("failed to fetch members", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while fetching the members")
	}

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("members not found")
		default:
			h.logger.Error("failed to fetch members", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the members")
		}
	}

	resp := &GetOffsetPaginatedBusinessMembersOutput{}
	resp.Body.Message = "Members fetched successfully"
	resp.Body.Members = members
	resp.Body.Total = total
	if len(members) > input.PageSize {
		resp.Body.HasMore = true
		resp.Body.Members = resp.Body.Members[:len(resp.Body.Members)-1]
	}

	return resp, nil
}
type GetAllMemberRolesOutput struct {
	Body struct {
		shared.MessageResponse
		Roles []business.BusinessMemberRole `json:"roles"`
	} `json:"body"`
}

func (h *httpHandler) getAllMemberRoles(ctx context.Context, input *shared.PathIDParam) (*GetAllMemberRolesOutput, error) {
	account := shared.GetAuthenticatedAccount(ctx)
	authorized, err := h.service.PermissionService.CanViewBusinessMembers(ctx, account.ID, input.ID)
	if err != nil {
		h.logger.Error("failed to check if account can view business member roles", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while checking authorization")
	}

	if !authorized {
		h.logger.Error("account is not authorized to view business member roles",
			zap.Any("account id", account.ID),
			zap.Any("business id", input.ID))

		return nil, huma.Error403Forbidden("Account is not authorized to view business member roles")
	}

	roles, err := h.service.BusinessService.GetAllMemberRoles(ctx, input.ID)
	if err != nil {
		h.logger.Error("failed to fetch member roles", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while fetching the member roles")
	}

	resp := &GetAllMemberRolesOutput{}
	resp.Body.Message = "Member roles fetched successfully"
	resp.Body.Roles = roles

	return resp, nil
}
