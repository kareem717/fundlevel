package util

import (
	"reflect"
	"testing"

	"github.com/stretchr/testify/assert"
)

func AssertEqualStruct[T any](t *testing.T, expected T, actual T) {
	expectedVal := reflect.ValueOf(expected)
	actualVal := reflect.ValueOf(actual)

	for i := 0; i < expectedVal.NumField(); i++ {
		assert.Equal(t, expectedVal.Field(i).Interface(), actualVal.Field(i).Interface())
	}
}
