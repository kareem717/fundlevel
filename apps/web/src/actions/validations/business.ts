import { object, string, number, date, array } from "yup";
import {
	CreateBusinessParams,
	BusinessParams,
	UpsertBusinessLegalSectionParams,
} from "../../lib/api";

export const createBusinessSchema = object<CreateBusinessParams>().shape({
	business: object<BusinessParams>().shape({
		foundingDate: date()
			.required("Founding date is required")
			.nonNullable("Founding date is required"),
		displayName: string()
			.min(3)
			.max(100)
			.required("Display name is required")
			.nonNullable("Display name is required"),
		employeeCount: string()
			.oneOf(
				["1", "2-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
				"Please select a valid team size"
			)
			.required("Employee count is required")
			.nonNullable("Employee count is required"),
		businessColour: string()
			.matches(/^#[0-9A-F]{6}$/, "Please enter a valid hex colour code")
			.nullable(),
	}),
	industryIds: array()
		.of(number().required().nonNullable())
		.required("Industry is required")
		.nonNullable("Industry is required"),
});

export const upsertBusinessLegalSectionSchema =
	object<UpsertBusinessLegalSectionParams>().shape({
		businessNumber: string()
			.min(1)
			.max(10)
			.required("Business number is required")
			.nonNullable("Business number is required"),
	});
