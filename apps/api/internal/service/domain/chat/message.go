package chat

import (
	"context"
	"time"

	"fundlevel/internal/entities/chat"
	postgres "fundlevel/internal/storage/shared"
)

func (s *ChatService) CreateMessage(ctx context.Context, params chat.CreateMessageParams) (chat.ChatMessage, error) {
	return s.repositories.Chat().CreateMessage(ctx, params)
}

func (s *ChatService) UpdateMessage(ctx context.Context, id int, params chat.UpdateMessageParams) (chat.ChatMessage, error) {
	return s.repositories.Chat().UpdateMessage(ctx, id, params)
}

func (s *ChatService) GetMessages(ctx context.Context, chatID int, filter chat.MessageFilter, limit int, cursor time.Time) ([]chat.ChatMessage, error) {
	pagination := postgres.TimeCursorPagination{
		Cursor: cursor,
		Limit:  limit,
	}

	return s.repositories.Chat().GetChatMessages(ctx, chatID, filter, pagination)
}

func (s *ChatService) DeleteMessage(ctx context.Context, id int) error {
	return s.repositories.Chat().DeleteMessage(ctx, id)
}

func (s *ChatService) GetMessageById(ctx context.Context, id int) (chat.ChatMessage, error) {
	return s.repositories.Chat().GetMessageById(ctx, id)
}
