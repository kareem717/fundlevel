import { object, number, date, string, array } from "yup";
import {
	CreateFixedTotalRoundParams,
	CreatePartialTotalRoundParams,
	CreateRoundParams,
	CreateRegularDynamicRoundParams,
	CreateDutchDynamicRoundParams,
	valueCurrency,
	PartialTotalRoundParams,
	RegularDynamicRoundParams,
	DutchDynamicRoundParams,
	GetRoundsData,
} from "../api";
import { currency, dollarAmount, paginationRequestSchema } from "./shared";

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(0, 0, 0, 0);

export const createRoundSchema = object<CreateRoundParams>()
	.shape({
		beginsAt: date()
			.min(tomorrow)
			.required(),
		endsAt: date().required(),
		percentageOffered: number().moreThan(0).lessThan(100).required(),
		percentageValue: number().min(1).required(),
		valueCurrency: currency.required(),
		ventureId: number().min(1).required(),
		status: string()
			.oneOf(["successful", "failed", "active"])
			.default("active"),
	})
	.test("is-valid-round-time", "End date must be after start date", (value) => {
		return value.beginsAt < value.endsAt;
	});

export const createFixedTotalRoundSchema =
	object<CreateFixedTotalRoundParams>().shape({
		round: createRoundSchema,
	});
export const createPartialTotalRoundSchema =
	object<CreatePartialTotalRoundParams>().shape({
		round: createRoundSchema,
		partialTotalRound: object<PartialTotalRoundParams>().shape({
			investorCount: number().min(1).required(),
		}),
	});
export const createRegularDynamicRoundSchema =
	object<CreateRegularDynamicRoundParams>().shape({
		round: createRoundSchema,
		regularDynamicRound: object<RegularDynamicRoundParams>().shape({
			daysExtendOnBid: number().min(1).required(),
		}),
	});
export const createDutchDynamicRoundSchema =
	object<CreateDutchDynamicRoundParams>().shape({
		round: createRoundSchema,
		dutchDynamicRound: object<DutchDynamicRoundParams>().shape({
			valuationDollarDropRate: number().moreThan(0).required(),
			valuationDropIntervalDays: number().min(1).required(),
			valuationStopLoss: number().moreThan(0).required(),
		}),
	});

export const roundFilterSchema = object().shape({
	paginationRequestSchema,
	status: array().of(string().oneOf(["active", "successful", "failed"]).required()), // Corrected type for status
	minEndsAt: date(),
	maxEndsAt: date(),
});
