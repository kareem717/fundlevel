import { createSafeActionClient } from "next-safe-action";
import { zodAdapter } from "next-safe-action/adapters/zod";
import { env } from "@/env";
import { createClient as createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { createClient as deprecatedCreateClient } from "@hey-api/client-axios";
import { createClient } from "@fundlevel/api/client";

export const actionClient = createSafeActionClient({
  validationAdapter: zodAdapter(),
  handleServerError: async (error) => {
    return {
      message: error.message,
    };
  },
}).use(async ({ next }) =>
  next({
    ctx: {
      axiosClient: deprecatedCreateClient({
        baseURL: env.NEXT_PUBLIC_BACKEND_API_URL,
      }),
      api: createClient({
        url: env.NEXT_PUBLIC_BACKEND_API_URL,
      }),
    },
  }),
);

export const actionClientWithUser = actionClient.use(async ({ next, ctx }) => {
  const sb = await createSupabaseServerClient();

  const {
    data: { session },
    error: sessionError,
  } = await sb.auth.getSession();

  if (sessionError) {
    throw new Error("Error getting user session");
  }

  if (!session) {
    throw new Error("User session empty");
  }

  // console.debug("session access token", session.access_token);

  ctx.axiosClient.setConfig({
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  const { data, error } = await sb.auth.getUser();

  if (error) {
    throw new Error("Error getting user");
  }

  if (!data?.user) {
    throw new Error("User data empty");
  }

  // Create typed API client with auth token
  const apiClient = createClient({
    bearer: session.access_token,
    url: env.NEXT_PUBLIC_BACKEND_API_URL,
  });

  return next({
    ctx: {
      ...ctx,
      user: data.user,
      session: session,
      api: apiClient,
    },
  });
});

export const actionClientWithAccount = actionClientWithUser.use(
  async ({ next, ctx }) => {
    let account = null;

    if (ctx.user?.id) {
      const response = await ctx.api.accounts.$get();

      if (response.status === 200) {
        account = await response.json();
      } else {
        console.error(
          "Error getting account by user id:",
          await response.json(),
        );
      }
    }

    return next({
      ctx: {
        ...ctx,
        account,
      },
    });
  },
);
