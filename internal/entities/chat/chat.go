package chat

import (
	"time"

	"fundlevel/internal/entities/shared"

	"github.com/uptrace/bun"
)

type Chat struct {
	bun.BaseModel `bun:"table:chats"`

	LastMessageAt *time.Time `json:"lastMessageAt"`

	CreateChatParams
	shared.IntegerID
	shared.Timestamps
}

type UpdateChatParams struct {
	LastMessageAt time.Time `json:"lastMessageAt"`
}

type CreateChatParams struct {
	CreatedByAccountID  int `json:"createdByAccountId" minimum:"1"`
	CreatedForAccountID int `json:"createdForAccountId" minimum:"1"`
}
