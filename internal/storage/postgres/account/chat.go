package account

import (
	"context"

	"fundlevel/internal/entities/chat"
	"fundlevel/internal/storage/shared"
)

func (r *AccountRepository) GetChatsByCursor(ctx context.Context, accountID int, pagination shared.TimeCursorPagination) ([]chat.Chat, error) {
	resp := []chat.Chat{}

	query := r.db.NewSelect().
		Model(&resp).
		Where("chat.created_by_account_id = ? OR chat.created_for_account_id = ?", accountID, accountID).
		OrderExpr("chat.last_message_at, chat.created_at DESC").
		Limit(pagination.Limit)

	if !pagination.Cursor.IsZero() {
		query.Where("chat.last_message_at <= ? OR (chat.last_message_at IS NULL AND chat.created_at <= ?)", pagination.Cursor, pagination.Cursor)
	}

	err := query.Scan(ctx)

	return resp, err
}
