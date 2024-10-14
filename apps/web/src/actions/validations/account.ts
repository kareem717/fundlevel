import { object, string } from "yup";
import { CreateAccountParams, UpdateAccountParams } from "../../lib/api";

export const createAccountSchema = object<CreateAccountParams>().shape({
	firstName: string().min(3).max(30).required(),
	lastName: string().min(3).max(30).required(),
});

export const updateAccountSchema = object<UpdateAccountParams>().shape({
	firstName: string().min(3).max(30).required(),
	lastName: string().min(3).max(30).required(),
});
