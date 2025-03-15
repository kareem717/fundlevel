import { Account } from "../../entities";
import { env } from "../../../env";
import { IAccountService } from "../../service";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import { User } from "@supabase/supabase-js";
import type { Context, MiddlewareHandler } from "hono";
import { setCookie } from "hono/cookie";

/**
 * Extends Hono's Context to include user and account objects
 */
declare module "hono" {
  interface ContextVariableMap {
    user: User | null;
    account: Account | null;
  }
}
export const getUser = (c: Context) => {
  return c.get("user");
};

export const getAccount = (c: Context) => {
  return c.get("account");
};

export const authMiddleware = (
  accountService: IAccountService,
  sb: {
    url: string;
    serviceKey: string;
  },
): MiddlewareHandler => {
  return async (c, next) => {
    const bearerToken = c.req.header("Authorization")?.split("Bearer ")[1];

    if (!bearerToken || bearerToken.length < 1) {
      return await next();
    }

    // Create Supabase client with cookie handling
    const supabase = createServerClient(sb.url, sb.serviceKey, {
      cookies: {
        getAll() {
          return parseCookieHeader(c.req.header("Cookie") ?? "");
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            let sameSite: "Strict" | "Lax" | "None" | undefined = undefined;
            let priority: "Low" | "Medium" | "High" | undefined = undefined;

            if (options.sameSite !== undefined) {
              switch (options.sameSite) {
                case "strict":
                  sameSite = "Strict";
                  break;
                case "lax":
                  sameSite = "Lax";
                  break;
                case "none":
                  sameSite = "None";
                  break;
              }
            }

            if (options.priority !== undefined) {
              switch (options.priority) {
                case "low":
                  priority = "Low";
                  break;
                case "medium":
                  priority = "Medium";
                  break;
                case "high":
                  priority = "High";
                  break;
              }
            }

            return setCookie(c, name, value, {
              ...options,
              sameSite,
              priority,
            });
          });
        },
      },
    });

    // Attempt to get authenticated user
    const { data, error } = await supabase.auth.getUser(bearerToken);

    if (error) {
      console.debug("Supabase authentication error:", error);
    }

    c.set("user", data.user);

    if (!data?.user) {
      return await next();
    }

    // Get account from user
    const account = await accountService.getByUserId(data.user.id);
    c.set("account", account || null);

    if (!account) {
      console.debug("Account not found for user:", data.user.id);
    }

    await next();
  };
};
