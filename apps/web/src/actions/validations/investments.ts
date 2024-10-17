import { number, object } from "yup";
import { CreateInvestmentParams } from "../../lib/api";

export const createInvestmentSchema = object<CreateInvestmentParams>().shape({
	roundId: number().min(1).required(),
});

export const withdrawInvestmentSchema = object().shape({
	investmentId: number().min(1).required(),
});