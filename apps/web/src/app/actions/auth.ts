"use server";

import { authClient } from "@web/lib/auth-client";
import { cache } from "react";

export const getSessionFn = cache(async () => {
	return await authClient().getSession();
});
