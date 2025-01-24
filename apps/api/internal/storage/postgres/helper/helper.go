package helper

import (
	"fmt"
	"time"

	"github.com/uptrace/bun"
)

// ApplyRangeFilter applies a range filter to a select query.
func ApplyRangeFilter[T any](query *bun.SelectQuery, field string, min, max T, isZero func(T) bool) {
	if !isZero(min) {
		query.Where(fmt.Sprintf("%s >= ?", field), min)
	}

	if !isZero(max) {
		query.Where(fmt.Sprintf("%s <= ?", field), max)
	}
}

// ApplyTimeRangeFilter applies a time range filter to a select query.
func ApplyTimeRangeFilter(query *bun.SelectQuery, field string, min, max time.Time) {
	ApplyRangeFilter(query, field, min, max, func(t time.Time) bool { return t.IsZero() })
}

// ApplyFloatRangeFilter applies a range filter to a select query.
func ApplyFloatRangeFilter(query *bun.SelectQuery, field string, min, max float64) {
	ApplyRangeFilter(query, field, min, max, func(f float64) bool { return f == 0 })
}

// ApplyIntRangeFilter applies a range filter to a select query.
func ApplyIntRangeFilter(query *bun.SelectQuery, field string, min, max int) {
	ApplyRangeFilter(query, field, min, max, func(i int) bool { return i == 0 })
}

func ApplyEqualFilter[T any](query *bun.SelectQuery, field string, value T, isZero func(T) bool) {
	if !isZero(value) {
		query.Where(fmt.Sprintf("%s = ?", field), value)
	}
}

func ApplyInArrayFilter[T any](query *bun.SelectQuery, field string, values []T) {
	if len(values) > 0 {
		query.Where(fmt.Sprintf("%s IN (?)", field), bun.In(values))
	}
}
