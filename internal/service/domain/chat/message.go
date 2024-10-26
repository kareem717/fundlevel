package chat

import (
	"context"

	"fundlevel/internal/entities/chat"
	postgres "fundlevel/internal/storage/shared"
)

func (s *ChatService) CreateMessage(ctx context.Context, params chat.CreateMessageParams) (chat.ChatMessage, error) {
	return s.repositories.Chat().CreateMessage(ctx, params)
}

func (s *ChatService) UpdateMessage(ctx context.Context, id int, params chat.UpdateMessageParams) (chat.ChatMessage, error) {
	return s.repositories.Chat().UpdateMessage(ctx, id, params)
}

func (s *ChatService) GetMessages(ctx context.Context, chatID int, filter chat.MessageFilter) ([]chat.ChatMessage, error) {
	return s.repositories.Chat().GetMessages(ctx, chatID, filter)
}

func (s *ChatService) DeleteMessage(ctx context.Context, id int) error {
	return s.repositories.Chat().DeleteMessage(ctx, id)
}

func (s *ChatService) GetMessagesByCursor(ctx context.Context, chatID int, pagination postgres.TimeCursorPagination) ([]chat.ChatMessage, error) {
	return s.repositories.Chat().GetMessagesByCursor(ctx, chatID, pagination)
}
