import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },
  client: {
    NEXT_PUBLIC_LANDING_URL: z.string().url(),
    NEXT_PUBLIC_CALENDAR_LINK: z.string().url(),
    NEXT_PUBLIC_WEB_URL: z.string().url()
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_LANDING_URL: process.env.NEXT_PUBLIC_LANDING_URL,
    NEXT_PUBLIC_CALENDAR_LINK: process.env.NEXT_PUBLIC_CALENDAR_LINK,
    NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL
  }
});
