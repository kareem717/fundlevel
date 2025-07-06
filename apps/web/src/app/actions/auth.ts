"use server";

import { cache } from "react";
import { authClient } from "@/lib/auth-client";

export const getSessionFn = cache(async () => {
	return await authClient().getSession();
});
