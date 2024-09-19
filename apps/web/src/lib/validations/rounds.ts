import { object, number, date, boolean } from "yup";
import { CreateRoundParams } from "../api";
import { currency, dollarAmount } from "./shared";

export const createRoundSchema = object<CreateRoundParams>()
	.shape({
		endTime: date().required(),
		isAuctioned: boolean().default(false),
		maximumInvestmentPercentage: number().min(0).max(100).required(),
		minimumInvestmentPercentage: number().min(0).max(100).required(),
		offeredPercentage: number().min(0).max(100).required(),
		startTime: date()
			.min(new Date(new Date().setDate(new Date().getDate() + 1)))
			.required(),
		percentageValue: dollarAmount.required(),
		percentageValueCurrency: currency.required(),
		ventureId: number().min(1).required(),
	})
	.test("is-valid-round-time", "End time must be after start time", (value) => {
		return value.startTime < value.endTime;
	})
	.test(
		"is-valid-round",
		"Minimum investment percentage must be less than or equal to maximum investment percentage",
		(value) => {
			return (
				value.minimumInvestmentPercentage <= value.maximumInvestmentPercentage
			);
		}
	)
	.test(
		"is-valid-round",
		"Maximum investment percentage must be less than or equal to offered percentage",
		(value) => {
			return value.maximumInvestmentPercentage <= value.offeredPercentage;
		}
	);
