import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from 'next-safe-action'
import { zodAdapter } from 'next-safe-action/adapters/zod'

export const actionClient = createSafeActionClient({
  validationAdapter: zodAdapter(),
  handleServerError: async (error) => {
    return {
      message: error.message ?? DEFAULT_SERVER_ERROR_MESSAGE,
      statusCode: 500,
    }
  },
})
