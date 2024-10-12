package business

import (
	"context"
	"database/sql"
	"errors"

	"fundlevel/internal/entities/business"
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

func (h *httpHandler) create(ctx context.Context, input *CreateBusinessRequest) (*shared.SingleBusinessResponse, error) {
	business, err := h.service.BusinessService.Create(ctx, input.Body)
	if err != nil {
		h.logger.Error("failed to create business", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while creating the business")
	}

	resp := &shared.SingleBusinessResponse{}
	resp.Body.Message = "Business created successfully"
	resp.Body.Business = &business

	return resp, nil
}

type DeleteBusinessOutput struct {
	Body shared.MessageResponse
}

func (h *httpHandler) delete(ctx context.Context, input *shared.PathIDParam) (*DeleteBusinessOutput, error) {
	err := h.service.BusinessService.Delete(ctx, input.ID)
	if err != nil {
		h.logger.Error("failed to delete business", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while deleting the business")
	}

	resp := &DeleteBusinessOutput{}
	resp.Body.Message = "Business deleted successfully"

	return resp, nil
}

type CreateBusinessMemberRequest struct {
	Body business.CreateBusinessMemberParams `json:"member"`
}

func (h *httpHandler) createMember(ctx context.Context, input *CreateBusinessMemberRequest) (*shared.SingleBusinessMemberResponse, error) {
	member, err := h.service.BusinessService.CreateMember(ctx, input.Body)
	if err != nil {
		h.logger.Error("failed to create business member", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while creating the business member")
	}

	resp := &shared.SingleBusinessMemberResponse{}
	resp.Body.Message = "Business member created successfully"
	resp.Body.BusinessMember = &member

	return resp, nil
}

type DeleteBusinessMemberOutput struct {
	Body shared.MessageResponse
}

type ParentBusinessIDParam struct {
	shared.PathIDParam
	BusinessID int `path:"businessId" minimum:"1"`
}

func (h *httpHandler) deleteMember(ctx context.Context, input *ParentBusinessIDParam) (*DeleteBusinessMemberOutput, error) {
	err := h.service.BusinessService.DeleteMember(ctx, input.BusinessID, input.ID)
	if err != nil {
		h.logger.Error("failed to delete business member", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while deleting the business member")
	}

	resp := &DeleteBusinessMemberOutput{}
	resp.Body.Message = "Business member deleted successfully"

	return resp, nil
}

type UpdateBusinessMemberRequest struct {
	BusinessID int `path:"businessId" minimum:"1"`
	shared.PathIDParam
	Body business.UpdateBusinessMemberParams `json:"member"`
}

func (h *httpHandler) updateMember(ctx context.Context, input *UpdateBusinessMemberRequest) (*shared.SingleBusinessMemberResponse, error) {
	member, err := h.service.BusinessService.UpdateMember(ctx, input.BusinessID, input.ID, input.Body)
	if err != nil {
		h.logger.Error("failed to update business member", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while updating the business member")
	}

	resp := &shared.SingleBusinessMemberResponse{}
	resp.Body.Message = "Business member updated successfully"
	resp.Body.BusinessMember = &member

	return resp, nil
}

type GetOffsetPaginatedBusinessMembersResponse struct {
	Body struct {
		shared.MessageResponse
		BusinessMembers []business.BusinessMember `json:"businessMembers"`
		shared.OffsetPaginationResponse
	}
}

func (h *httpHandler) getMembersByPage(ctx context.Context, input *shared.GetOffsetPaginatedByParentPathIDInput) (*GetOffsetPaginatedBusinessMembersResponse, error) {
	members, err := h.service.BusinessService.GetMembersByPage(ctx, input.ID, input.PageSize, input.Page)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("Business members not found")
		default:
			h.logger.Error("failed to fetch business members", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the business members")
		}
	}

	resp := &GetOffsetPaginatedBusinessMembersResponse{}
	resp.Body.Message = "Business members fetched successfully"
	resp.Body.BusinessMembers = members

	if len(members) > input.PageSize {
		resp.Body.HasMore = true
		resp.Body.BusinessMembers = resp.Body.BusinessMembers[:input.PageSize]
	}

	return resp, nil
}

type GetRoundsByFilterAndCursorInput struct {
	shared.PathIDParam
	shared.CursorPaginationRequest
	round.RoundFilter
}

func (h *httpHandler) getRoundsByFilterAndCursor(ctx context.Context, input *GetRoundsByFilterAndCursorInput) (*shared.GetCursorPaginatedRoundsWithSubtypesOutput, error) {
	limit := input.Limit + 1

	rounds, err := h.service.BusinessService.GetRoundsByFilterAndCursor(ctx, input.ID, input.RoundFilter, limit, input.Cursor)

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

func (h *httpHandler) getCursorPaginatedRecievedRoundInvestments(ctx context.Context, input *shared.GetCursorPaginatedByParentPathIDInput) (*shared.GetCursorPaginatedRoundInvestmentsOutput, error) {
	limit := input.Limit + 1

	investments, err := h.service.BusinessService.GetRecievedRoundInvestmentsByCursor(ctx, input.ID, limit, input.Cursor)

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

func (h *httpHandler) getCursorPaginatedVentures(ctx context.Context, input *shared.GetCursorPaginatedByParentPathIDInput) (*shared.GetCursorPaginatedVenturesOutput, error) {
	limit := input.Limit + 1

	ventures, err := h.service.BusinessService.GetVenturesByCursor(ctx, input.ID, limit, input.Cursor)

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
	ventures, err := h.service.BusinessService.GetVenturesByPage(ctx, input.ID, input.PageSize, input.Page)

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

	if len(ventures) > input.PageSize {
		resp.Body.HasMore = true
		resp.Body.Ventures = resp.Body.Ventures[:len(resp.Body.Ventures)-1]
	}

	return resp, nil
}
