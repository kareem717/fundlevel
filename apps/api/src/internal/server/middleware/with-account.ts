import { IAuthService } from '@fundlevel/api/internal/service'
import { Account } from '@fundlevel/db/types'
import { getAuth } from '@hono/clerk-auth'
import type { Context, MiddlewareHandler } from 'hono'

/**
 * Extends Hono's Context to include user and account objects
 */
declare module 'hono' {
  interface ContextVariableMap {
    account: Account | null
  }
}

export const getAccount = (c: Context) => {
  return c.get('account')
}

export const withAccount = (authService: IAuthService): MiddlewareHandler => {
  return async (c, next) => {
    const auth = getAuth(c)
    
    if (!auth?.userId) {
      return await next()
    }

    const account = await authService.getAccountByUserId(auth.userId)
    c.set('account', account || null)

    await next()
  }
}