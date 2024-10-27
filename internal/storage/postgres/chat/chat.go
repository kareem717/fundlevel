package chat

import (
	"context"
	"fundlevel/internal/entities/chat"
	"fundlevel/internal/storage/postgres/helper"
	"fundlevel/internal/storage/shared"

	"github.com/uptrace/bun"
)

type ChatRepository struct {
	db  bun.IDB
	ctx context.Context
}

func NewChatRepository(db bun.IDB, ctx context.Context) *ChatRepository {
	return &ChatRepository{db: db, ctx: ctx}
}

func (r *ChatRepository) Create(ctx context.Context, params chat.CreateChatParams) (chat.Chat, error) {
	resp := chat.Chat{}

	err := r.db.NewInsert().
		Model(&params).
		ModelTableExpr("chats").
		Returning("*").
		Scan(ctx, &resp)

	return resp, err
}

func (r *ChatRepository) GetChatMessages(ctx context.Context, chatID int, filter chat.MessageFilter, pagination shared.TimeCursorPagination) ([]chat.ChatMessage, error) {
	resp := []chat.ChatMessage{}

	query := r.db.NewSelect().
		Model(&resp).
		Join("INNER JOIN chats").
		JoinOn("chats.id = chat_message.chat_id AND chats.id = ?", chatID).
		OrderExpr("chat_message.created_at DESC").
		Limit(pagination.Limit)

	if !pagination.Cursor.IsZero() {
		query.Where("chat_message.created_at <= ?", pagination.Cursor)
	}

	helper.ApplyTimeRangeFilter(query, "chat_message.created_at", filter.MinCreatedAt, filter.MaxCreatedAt)

	helper.ApplyInArrayFilter(query, "chat_message.sender_account_id", filter.SenderAccountIDs)

	if filter.Read == true {
		query.Where("chat_message.read_at IS NOT NULL")
	} else if filter.Read == false {
		query.Where("chat_message.read_at IS NULL")
	}

	err := query.Scan(ctx)

	return resp, err
}

func (r *ChatRepository) Delete(ctx context.Context, chatID int) error {
	_, err := r.db.NewDelete().
		Model(&chat.Chat{}).
		Where("id = ?", chatID).
		Exec(ctx)

	return err
}

func (r *ChatRepository) Update(ctx context.Context, chatID int, params chat.UpdateChatParams) (chat.Chat, error) {
	resp := chat.Chat{}

	err := r.db.NewUpdate().
		Model(&params).
		ModelTableExpr("chats").
		Where("id = ?", chatID).
		Returning("*").
		OmitZero().
		Scan(ctx, &resp)

	return resp, err
}

func (r *ChatRepository) GetById(ctx context.Context, id int) (chat.Chat, error) {
	resp := chat.Chat{}
	err := r.db.NewSelect().Model(&resp).Where("id = ?", id).Scan(ctx)

	return resp, err
}

func (r *ChatRepository) IsAccountInChat(ctx context.Context, chatID int, accountID int) (bool, error) {
	exists, err := r.db.NewSelect().
		Model(&chat.Chat{}).
		Where("id = ? AND (created_by_account_id = ? OR created_for_account_id = ?)", chatID, accountID, accountID).
		Exists(ctx)

	return exists, err
}

func (r *ChatRepository) GetChatByAccountIds(ctx context.Context, accountIdOne int, accountIdTwo int) (chat.Chat, error) {
	resp := chat.Chat{}
	err := r.db.NewSelect().
		Model(&resp).
		Where(
			"(created_by_account_id = ? AND created_for_account_id = ?) OR (created_by_account_id = ? AND created_for_account_id = ?)",
			accountIdOne, accountIdTwo, accountIdTwo, accountIdOne,
		).
		Scan(ctx)

	return resp, err
}
