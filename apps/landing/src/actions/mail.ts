"use server";

import { actionClient } from "@fundlevel/landing/lib/safe-action";
import { z } from "zod";
import { BeehiivClient } from "@beehiiv/sdk";
import { env } from "@fundlevel/landing/env";

export const subscribeToNewsletter = actionClient
  .schema(z.string().email())
  .action(async ({ parsedInput: email }) => {
    const client = new BeehiivClient({ token: env.BEEHIIV_API_KEY });

    try {
      await client.subscriptions.create(env.BEEHIIV_PUBLICATION_ID, {
        email,
      });
    } catch (error) {
      console.error(error);
      throw new Error("Failed to subscribe to newsletter");
    }
  });
