import { object, string, number, date } from "yup";
import { CreateBusinessParams, BusinessParams } from "../api";
import { createAddressSchema } from "./address";

export const createBusinessSchema = object<CreateBusinessParams>().shape({
	address: createAddressSchema,
	business: object<BusinessParams>().shape({
		businessNumber: string().required(),
		foundingDate: date().required(),
		name: string().min(3).max(100).required(),
	}),
});
