import { number, object, string } from "yup";
import { CreateAccountParams, UpdateAccountParams } from "../api";

export const paginationRequestSchema = object().shape({
	cursor: number().min(1).default(1).optional(),
	limit: number().min(1).max(100).default(10).optional(),
});

export const currency = string().oneOf([
	"USD",
	"GBP",
	"EUR",
	"CAD",
	"AUD",
	"JPY",
]);

export const dollarAmount = number().min(0).max(9999999999.99);

export const intIdSchema = number().min(1).integer()
