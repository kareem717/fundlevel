import { bool, number, object, string } from "yup";
import {
	CreateVentureParams,
	VentureParams,
	UpdateVentureParams,
} from "../api";
import { createAddressSchema } from "./address";
import { intIdSchema } from "./shared";

export const createVentureSchema = object<CreateVentureParams>().shape({
	address: createAddressSchema,
	venture: object<VentureParams>().shape({
		businessId: number().required(),
		description: string().min(3).max(5000).required(),
		isRemote: bool().required(),
		name: string().min(3).max(100).required(),
		teamSize: string()
			.oneOf(["0-1", "2-10", "11-50", "51-200", "201-500", "501-1000", "1000+"])
			.required(),
	}),
});

export const updateVentureSchema = object<UpdateVentureParams>().shape({
	id: intIdSchema.required(),
	name: string().min(3).max(100).required(),
	description: string().min(3).max(5000).required(),
});
