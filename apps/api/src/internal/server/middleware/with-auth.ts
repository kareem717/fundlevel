import { Account } from '@fundlevel/db/types'
import type { Context, MiddlewareHandler } from 'hono'
import { getCookie } from 'hono/cookie'
import { HTTPException } from 'hono/http-exception'
import { createClerkClient, verifyToken } from '@clerk/backend'
import { getService } from './with-service-layer'
import { env } from 'hono/adapter'

/**
 * Extends Hono's Context to include user and account objects
 */
declare module 'hono' {
  interface ContextVariableMap {
    account: Account | null
    userId: string | null
  }
}

export const getAccount = (c: Context) => {
  return c.get('account')
}

export const getUserId = (c: Context) => {
  return c.get('userId')
}

export const withAuth = (): MiddlewareHandler => {
  return async (c, next) => {
    const service = getService(c)

    const cookies = getCookie(c);
    const sessionCookie = cookies["__session"];
    const authorization = c.req.header("Authorization")?.replace("Bearer ", "");

    const token = sessionCookie || authorization;
    const clerkClient = createClerkClient({
      secretKey: c.env.CLERK_SECRET_KEY,
      publishableKey: c.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    });

    if (!token) {
      c.set('userId', null)
      c.set('account', null)
      return await next()
    }

    let userId: string | null = null

    try {
      let verifiedToken: Awaited<ReturnType<typeof verifyToken>> | null = null

      try {
        verifiedToken = await verifyToken(token, {
          jwtKey: env(c).CLERK_PUBLIC_JWT_KEY,
          secretKey: env(c).CLERK_SECRET_KEY,
          clockSkewInMs: 120000,
          authorizedParties: [
            env(c).WEB_URL,
            env(c).APP_URL,
          ],
        });
      } catch (error) {
        throw new HTTPException(500, {
          message: "Failed to verify token.",
        });
      }


      if (!verifiedToken) {
        throw new HTTPException(401, {
          message: "Unauthorized",
        });
      }

      const session = await clerkClient.sessions.getSession(verifiedToken.sid);

      userId = session.userId
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error;
      }

      throw new HTTPException(500, {
        message: "Failed to verify token.",
      });
    }

    c.set('userId', userId)

    if (userId) {
      const account = await service.auth.getAccountByUserId(userId)
      c.set('account', account)
    } else {
      c.set('account', null)
    }

    await next()
  }
}