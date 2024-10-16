import { number, object, string } from "yup";
import { CreateVentureParams, UpdateVentureParams } from "../../lib/api";
import { intIdSchema } from "./shared";

export const createVentureSchema = object<CreateVentureParams>().shape({
	businessId: number().required(),
	description: string().min(3).max(5000).required(),
	name: string().min(3).max(100).required(),
});

export const updateVentureSchema = object<UpdateVentureParams>().shape({
	id: intIdSchema.required(),
	name: string().min(3).max(100).required(),
	description: string().min(3).max(5000).required(),
});
