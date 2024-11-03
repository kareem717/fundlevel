import { object, string, number, date, bool } from "yup";
import { CreateBusinessParams, BusinessParams } from "../../lib/api";
import { createAddressSchema } from "./address";

export const createBusinessSchema = object<CreateBusinessParams>().shape({
	address: createAddressSchema,
	business: object<BusinessParams>().shape({
		businessNumber: string().required("Business number is required"),
		foundingDate: date().required("Founding date is required"),
		name: string().min(3).max(100).required("Business name is required"),
		isRemote: bool().default(false),
		teamSize: string()
			.oneOf(["1", "2-10", "11-50", "51-200", "201-500", "501-1000", "1000+"], "Please select a valid team size")
			.required("Team size is required"),
		industryId: number().min(1, "Please select a valid industry").required("Industry is required"),
	}),
});