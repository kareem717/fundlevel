import env from "@fundlevel/api/env";
import { Nango } from "@nangohq/node";

export const createNangoClient = () =>
	new Nango({
		secretKey: env.NANGO_SECRET_KEY,
	});
