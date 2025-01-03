package chat

import (
	"context"

	"fundlevel/internal/entities/chat"
)

func (r *ChatRepository) CreateMessage(ctx context.Context, params chat.CreateMessageParams) (chat.ChatMessage, error) {
	resp := chat.ChatMessage{}

	err := r.db.NewInsert().
		Model(&params).
		ModelTableExpr("chat_messages").
		Returning("*").
		Scan(ctx, &resp)

	return resp, err
}

func (r *ChatRepository) UpdateMessage(ctx context.Context, id int, params chat.UpdateMessageParams) (chat.ChatMessage, error) {
	resp := chat.ChatMessage{}

	err := r.db.NewUpdate().
		Model(&params).
		ModelTableExpr("chat_messages").
		Where("id = ?", id).
		OmitZero().
		Returning("*").
		Scan(ctx, &resp)

	return resp, err
}

func (r *ChatRepository) DeleteMessage(ctx context.Context, id int) error {
	_, err := r.db.NewDelete().
		Model(&chat.ChatMessage{}).
		Where("id = ?", id).
		Exec(ctx)

	return err
}

func (r *ChatRepository) GetMessageById(ctx context.Context, messageId int) (chat.ChatMessage, error) {
	resp := chat.ChatMessage{}

	err := r.db.NewSelect().Model(&resp).Where("id = ?", messageId).Scan(ctx)

	return resp, err
}
