import { object, number, date, string } from "yup";
import { CreateRoundParams } from "../../lib/api";
import { currency } from "./shared";

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(0, 0, 0, 0);

export const createRoundSchema = object<CreateRoundParams>()
	.shape({
		beginsAt: date().min(tomorrow).required(),
		endsAt: date().required(),
		percentageOffered: number().moreThan(0).lessThan(100).required(),
		percentageValue: number().min(1).required(),
		valueCurrency: currency.required(),
		ventureId: number().min(1).required(),
		description: string().min(10).max(3000).required(),
		investorCount: number().min(1).required(),
	})
	.test("is-valid-round-time", "End date must be after start date", (value) => {
		return value.beginsAt < value.endsAt;
	});
