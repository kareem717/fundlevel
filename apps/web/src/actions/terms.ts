"use server";

import { actionClient } from "@/lib/safe-action";
import { headers } from "next/headers";

export const getSignatureAction = actionClient
	.action(
		async () => {
      const headersList = await headers()
      const ipAddress = headersList.get("x-forwarded-for")
      const userAgent = headersList.get("user-agent")

      if (!ipAddress || !userAgent) {
        throw new Error("IP address or user agent not found");
      }

      return { ipAddress, userAgent };
		}
	);