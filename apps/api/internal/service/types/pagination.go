package types

type CursorPaginationOutput[T any] struct {
	NextCursor *T `json:"next_cursor"`
}
