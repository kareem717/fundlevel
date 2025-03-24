import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    BEEHIIV_API_KEY: z.string().min(1),
    BEEHIIV_PUBLICATION_ID: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_LANDING_URL: z.string().url().min(1),
    NEXT_PUBLIC_WEB_URL: z.string().url().min(1),
    NEXT_PUBLIC_NEWS_LETTER_SIGN_UP_URL: z.string().url(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_LANDING_URL: process.env.NEXT_PUBLIC_LANDING_URL,
    NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL,
    NEXT_PUBLIC_NEWS_LETTER_SIGN_UP_URL:
      process.env.NEXT_PUBLIC_NEWS_LETTER_SIGN_UP_URL,
  },
  skipValidation: process.env.NODE_ENV === "production",
});
