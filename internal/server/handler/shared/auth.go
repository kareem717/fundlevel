package shared

import (
	"context"

	"github.com/supabase-community/gotrue-go/types"
	"fundlevel/internal/entities/account"
)

const (
	UserContextKey    = "user"
	AccountContextKey = "account"
	FooBearerTokenKey = "fbt"
)

func GetFooBearerToken(ctx context.Context) string {
	if ctxValue, ok := ctx.Value(FooBearerTokenKey).(string); ok {
		return ctxValue
	}

	return ""
}

func GetAuthenticatedUser(ctx context.Context) types.User {
	if ctxValue, ok := ctx.Value(UserContextKey).(types.User); ok {
		return ctxValue
	}

	return types.User{}
}

func GetAuthenticatedAccount(ctx context.Context) account.Account {
	if ctxValue, ok := ctx.Value(AccountContextKey).(account.Account); ok {
		return ctxValue
	}

	return account.Account{}
}
