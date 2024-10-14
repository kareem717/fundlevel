import { number, object, string } from "yup";
import { CreateInvestmentParams } from "../../lib/api";

export const createRoundInvestmentSchema =
	object<CreateInvestmentParams>().shape({
		amount: number().min(1).required(),
		roundId: number().min(1).required(),
	});
