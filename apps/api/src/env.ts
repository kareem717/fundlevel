import { z } from "@hono/zod-openapi"
import { config } from "dotenv"
import { expand } from "dotenv-expand"


const EnvSchema = z.object({
  PORT: z.coerce.number().default(8080),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string(),
  CLERK_SECRET_KEY: z.string(),
  CLERK_PUBLISHABLE_KEY: z.string(),
  QUICK_BOOKS_CLIENT_ID: z.string(),
  QUICK_BOOKS_CLIENT_SECRET: z.string(),
  QUICK_BOOKS_REDIRECT_URI: z.string(),
  QUICK_BOOKS_ENVIRONMENT: z.enum(['sandbox', 'production']).default('sandbox'),
  PLAID_CLIENT_ID: z.string(),
  PLAID_SECRET: z.string(),
  PLAID_WEBHOOK_URL: z.string(),
  PLAID_ENVIRONMENT: z.enum(['sandbox', 'production']).default('sandbox'),
})

const parsed = EnvSchema.safeParse(expand(config()))

if (!parsed.success) {
  console.error(parsed.error)
  process.exit(1)
}

export const env = parsed.data