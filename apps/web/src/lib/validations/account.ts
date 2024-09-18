import { object, string } from "yup";
import { CreateAccountParams, UpdateAccountParams } from "../api";

export const createAccountSchema = object<CreateAccountParams>().shape({
	name: string().required(),
});

export const updateAccountSchema = object<UpdateAccountParams>().shape({
	name: string().required(),
});
