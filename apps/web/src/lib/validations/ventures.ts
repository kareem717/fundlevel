import { object, string } from "yup";
import { CreateVentureParams } from "../api";

export const createVentureSchema = object<CreateVentureParams>().shape({
	name: string().min(3).max(100).required(),
	description: string().min(3).max(5000).required(),
});
