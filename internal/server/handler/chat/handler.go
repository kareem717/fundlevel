package chat

import (
	"context"
	"fundlevel/internal/entities/chat"
	"fundlevel/internal/server/handler/shared"
	"fundlevel/internal/service"
	"time"

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

type CreateChatRequest struct {
	Body chat.CreateChatParams
}

type CreateChatResponse struct {
	Body struct {
		chat.Chat `json:"chat"`
		shared.MessageResponse
	}
}

func (h *httpHandler) createChat(ctx context.Context, req *CreateChatRequest) (*CreateChatResponse, error) {
	account := shared.GetAuthenticatedAccount(ctx)

	if req.Body.CreatedByAccountID != account.ID && req.Body.CreatedForAccountID != account.ID {
		return nil, huma.Error400BadRequest("You cannot create a chat without yourself in it")
	}

	//TODO: maybe create some rules to only allow the person to chat with particular accounts
	chat, err := h.service.ChatService.Create(ctx, req.Body)
	if err != nil {
		h.logger.Error("failed to create chat", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while creating the chat")
	}

	resp := &CreateChatResponse{}
	resp.Body.Chat = chat
	resp.Body.Message = "Chat created successfully"
	return resp, nil
}

type CreateChatMessageRequest struct {
	shared.PathIDParam
	Body chat.CreateMessageParams
}

func (h *httpHandler) createChatMessage(ctx context.Context, req *CreateChatMessageRequest) (*shared.MessageOutput, error) {
	account := shared.GetAuthenticatedAccount(ctx)
	
	isInChat, err := h.service.ChatService.IsAccountInChat(ctx, req.ID, account.ID)
	if err != nil {
		h.logger.Error("failed to check if account is in chat", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while checking if account is in chat")
	}

	if !isInChat {
		return nil, huma.Error400BadRequest("You cannot create a chat message for a chat you are not in")
	}

	req.Body.ChatID = req.ID
	message, err := h.service.ChatService.CreateMessage(ctx, req.Body)
	if err != nil {
		h.logger.Error("failed to create chat message", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while creating the chat message")
	}

	resp := &shared.MessageOutput{}
	resp.Body.Message = "Message created successfully"

	// Update the chat last message at optimistically
	go func() {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		updateChatParams := chat.UpdateChatParams{
			LastMessageAt: message.CreatedAt,
		}

		_, err := h.service.ChatService.Update(ctx, req.ID, updateChatParams)
		if err != nil {
			h.logger.Error("failed to update chat last message", zap.Error(err))
		}
	}()

	return resp, nil
}

type DeleteChatMessageRequest struct {
	shared.PathIDParam
}

func (h *httpHandler) deleteChatMessage(ctx context.Context, req *DeleteChatMessageRequest) (*shared.MessageOutput, error) {
	message, err := h.service.ChatService.GetMessageById(ctx, req.ID)
	if err != nil {
		h.logger.Error("failed to get chat message", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while getting the chat message")
	}

	if account := shared.GetAuthenticatedAccount(ctx); message.SenderAccountID != account.ID {
		return nil, huma.Error400BadRequest("You cannot delete a chat message that is not yours")
	}

	err = h.service.ChatService.DeleteMessage(ctx, req.ID)
	if err != nil {
		h.logger.Error("failed to delete chat message", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while deleting the chat message")
	}

	resp := &shared.MessageOutput{}
	resp.Body.Message = "Message created successfully"

	return resp, nil
}

type UpdateChatMessageRequest struct {
	shared.PathIDParam
	Body chat.UpdateMessageParams
}

func (h *httpHandler) updateChatMessage(ctx context.Context, req *UpdateChatMessageRequest) (*shared.MessageOutput, error) {
	message, err := h.service.ChatService.GetMessageById(ctx, req.ID)
	if err != nil {
		h.logger.Error("failed to get chat message", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while getting the chat message")
	}

	if account := shared.GetAuthenticatedAccount(ctx); message.SenderAccountID != account.ID {
		return nil, huma.Error400BadRequest("You cannot update a chat message that is not yours")
	}

	message, err = h.service.ChatService.UpdateMessage(ctx, req.ID, req.Body)
	if err != nil {
		h.logger.Error("failed to update chat message", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while updating the chat message")
	}

	resp := &shared.MessageOutput{}
	resp.Body.Message = "Message updated successfully"

	return resp, nil
}

func (h *httpHandler) deleteChat(ctx context.Context, req *shared.PathIDParam) (*shared.MessageOutput, error) {
	account := shared.GetAuthenticatedAccount(ctx)
	isInChat, err := h.service.ChatService.IsAccountInChat(ctx, req.ID, account.ID)
	if err != nil {
		h.logger.Error("failed to check if account is in chat", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while checking if account is in chat")
	}

	if !isInChat {
		return nil, huma.Error400BadRequest("You cannot delete a chat you are not in")
	}

	err = h.service.ChatService.Delete(ctx, req.ID)
	if err != nil {
		h.logger.Error("failed to delete chat", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while deleting the chat")
	}

	resp := &shared.MessageOutput{}
	resp.Body.Message = "Chat deleted successfully"
	return resp, nil
}

type GetChatMessagesRequest struct {
	shared.PathIDParam
	shared.TimeCursorPaginationRequest
	chat.MessageFilter
}

type GetChatMessagesResponse struct {
	Body struct {
		Messages []chat.ChatMessage `json:"messages"`
		shared.MessageResponse
		shared.TimeCursorPaginationResponse
	}
}

func (h *httpHandler) getChatMessages(ctx context.Context, req *GetChatMessagesRequest) (*GetChatMessagesResponse, error) {
	account := shared.GetAuthenticatedAccount(ctx)
	isInChat, err := h.service.ChatService.IsAccountInChat(ctx, req.ID, account.ID)
	if err != nil {
		h.logger.Error("failed to check if account is in chat", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while checking if account is in chat")
	}

	if !isInChat {
		return nil, huma.Error400BadRequest("You cannot get messages for a chat you are not in")
	}

	messages, err := h.service.ChatService.GetMessages(ctx, req.ID, req.MessageFilter, req.Limit, req.Cursor)
	if err != nil {
		h.logger.Error("failed to get chat messages", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while getting the chat messages")
	}

	resp := &GetChatMessagesResponse{}
	resp.Body.Message = "Messages fetched successfully"
	resp.Body.Messages = messages

	if len(messages) == req.Limit {
		resp.Body.NextCursor = &messages[len(messages)-1].CreatedAt
		resp.Body.HasNext = true
		resp.Body.Messages = resp.Body.Messages[:len(resp.Body.Messages)-1]
	}

	return resp, nil
}
