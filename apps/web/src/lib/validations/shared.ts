import { number, object, string } from "yup";
import { CreateAccountParams, UpdateAccountParams } from "../api";

export const paginationRequestSchema = object().shape({
	cursor: number().min(1).default(1).optional(),
	limit: number().min(1).max(100).default(10).optional(),
});
