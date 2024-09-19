import { object, number } from "yup";
import { CreateOfferParams } from "../api";
import { dollarAmount, currency } from "./shared";

export const createOfferSchema = object<CreateOfferParams>().shape({
	percentageAmount: number()
		.min(0)
		.max(100)
		.test(
			"is-decimal",
			"Percentage amount must be a multiple of 0.001",
			(value) => {
				return typeof value === "number" && value % 0.001 === 0;
			}
		)
		.required(),
	roundId: number().min(1).required(),
	amount: dollarAmount.required(),
	currency: currency.required(),
});
