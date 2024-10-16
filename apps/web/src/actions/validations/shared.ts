import { number, object, string } from "yup";

export const currency = string().oneOf([
	"usd",
	"gbp",
	"eur",
	"cad",
	"aud",
	"jpy",
]);


export const dollarAmount = number().min(0).max(9999999999.99);

export const intIdSchema = number().min(1).integer();

export const cursorPaginationSchema = object().shape({
	cursor: number().min(1).default(1).optional(),
	limit: number().min(1).max(100).default(10).optional(),
});

export const offsetPaginationSchema = object().shape({
	offset: number().min(0).default(0).optional(),
	limit: number().min(1).max(100).default(10).optional(),
});

export const getByParentIdWithCursorSchema = object().shape({
	parentId: intIdSchema.required(),
	cursorPaginationSchema,
});
