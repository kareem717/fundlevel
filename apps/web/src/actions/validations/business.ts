import { object, string, number, date, bool } from "yup";
import { CreateBusinessParams, BusinessParams } from "../../lib/api";
import { createAddressSchema } from "./address";

export const createBusinessSchema = object<CreateBusinessParams>().shape({
	address: createAddressSchema,
	business: object<BusinessParams>().shape({
		businessNumber: string().required(),
		foundingDate: date().required(),
		name: string().min(3).max(100).required(),
		isRemote: bool().required(),
		teamSize: string()
			.oneOf(["0-1", "2-10", "11-50", "51-200", "201-500", "501-1000", "1000+"])
			.required(),
		industryId: number().min(1).required(),
	}),
});
