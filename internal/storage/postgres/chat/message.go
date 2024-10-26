package chat

import (
	"context"
	"errors"

	"fundlevel/internal/entities/chat"
)

func (r *ChatRepository) CreateMessage(ctx context.Context, params chat.CreateMessageParams) (chat.ChatMessage, error) {
	resp := chat.ChatMessage{}

	err := r.db.NewInsert().
		Model(&params).
		Returning("*").
		Scan(ctx, &resp)

	return resp, err
}

func (r *ChatRepository) UpdateMessage(ctx context.Context, id int, params chat.UpdateMessageParams) (chat.ChatMessage, error) {
	resp := chat.ChatMessage{}

	err := r.db.NewUpdate().
		Model(&params).
		Where("id = ?", id).
		OmitZero().
		Returning("*").
		Scan(ctx, &resp)

	return resp, err
}

func (r *ChatRepository) DeleteMessage(ctx context.Context, id int) error {

	execResp, err := r.db.NewDelete().
		Model(&chat.ChatMessage{}).
		Where("id = ?", id).
		Exec(ctx)

	rowsAffected, err := execResp.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return errors.New("no rows affected")
	}

	return err
}
