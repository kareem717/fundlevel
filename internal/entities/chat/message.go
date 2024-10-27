package chat

import (
	"fundlevel/internal/entities/shared"
	"time"

	"github.com/uptrace/bun"
)

type ChatMessage struct {
	bun.BaseModel `bun:"table:chat_messages"`
	CreateMessageParams
	ReadAt *time.Time `json:"readAt" format:"date-time"`
	shared.IntegerID
	shared.Timestamps
}

type CreateMessageParams struct {
	ChatID          int    `json:"chatId" minimum:"1" hidden:"true"`
	Content         string `json:"content" minLength:"1" maxLength:"1000"`
	SenderAccountID int    `json:"senderAccountId" minimum:"1"`
}

type UpdateMessageParams struct {
	Content string     `json:"content" minLength:"1" maxLength:"1000"`
	ReadAt  *time.Time `json:"readAt" format:"date-time"`
}

type MessageFilter struct {
	SenderAccountIDs []int     `query:"senderAccountIds" minItems:"1" maxItems:"2" uniqueItems:"true" minimum:"1" required:"false"`
	Read             bool      `query:"read" required:"false"`
	MinCreatedAt     time.Time `query:"minCreatedAt" format:"date-time" required:"false"`
	MaxCreatedAt     time.Time `query:"maxCreatedAt" format:"date-time" required:"false"`
}
