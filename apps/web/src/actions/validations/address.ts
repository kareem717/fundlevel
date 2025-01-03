import { object, string, number } from "yup";

export const createAddressSchema = object().shape({
	city: string().required(),
	country: string().required(),
	district: string().required(),
	fullAddress: string().required(),
	line1: string().required(),
	line2: string().optional().default(""),
	postalCode: string().required(),
	rawJson: object().required(),
	region: string().required(),
	regionCode: string().required(),
	xCoordinate: number().required(),
	yCoordinate: number().required(),
});
