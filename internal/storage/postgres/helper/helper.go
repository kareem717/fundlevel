package helper

import (
	"fmt"
	"fundlevel/internal/entities/investment"
	"fundlevel/internal/entities/round"
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

func ApplyRoundFilter(query *bun.SelectQuery, filter round.RoundFilter) *bun.SelectQuery {
	ApplyTimeRangeFilter(
		query, "round.begins_at",
		filter.MinimumBeginsAt, filter.MaximumBeginsAt,
	)

	ApplyTimeRangeFilter(
		query, "round.ends_at",
		filter.MinimumEndsAt, filter.MaximumEndsAt,
	)

	ApplyFloatRangeFilter(
		query, "round.percentage_offered",
		filter.MinimumPercentageOffered, filter.MaximumPercentageOffered,
	)

	ApplyIntRangeFilter(
		query, "round.percentage_value",
		filter.MinimumPercentageValue, filter.MaximumPercentageValue,
	)

	ApplyIntRangeFilter(
		query, "round.investor_count",
		filter.MinimumInvestorCount, filter.MaximumInvestorCount,
	)

	ApplyFloatRangeFilter(
		query, "round.buy_in",
		filter.MinimumBuyIn, filter.MaximumBuyIn,
	)

	if len(filter.Status) > 0 {
		query.Where("round.status IN (?)", bun.In(filter.Status))
	}

	if filter.ValueCurrencies != "" {
		query.Where("round.value_currency = ?", filter.ValueCurrencies)
	}

	if filter.SortBy != "" {
		query.OrderExpr(fmt.Sprintf("%s, round.id %s", filter.SortBy, filter.SortOrder))
	} else {
		query.Order(fmt.Sprintf("round.id %s", filter.SortOrder))
	}

	return query
}

func ApplyInvestmentFilter(query *bun.SelectQuery, filter investment.InvestmentFilter) *bun.SelectQuery {
	if len(filter.Status) > 0 {
		query.Where("investment.status IN (?)", bun.In(filter.Status))
	}

	if filter.SortBy != "" {
		query.OrderExpr(fmt.Sprintf("%s, investment.id %s", filter.SortBy, filter.SortOrder))
	} else {
		query.Order(fmt.Sprintf("investment.id %s", filter.SortOrder))
	}

	return query
}
