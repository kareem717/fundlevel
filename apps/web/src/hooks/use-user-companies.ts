import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../lib/config/query-keys";
import { client } from "@fundlevel/sdk";
import { env } from "../env";
import { getTokenCached } from "../actions/auth";
import { toast } from "@fundlevel/ui/components/sonner";

export function useUserCompanies() {
  return useQuery({
    queryKey: [QUERY_KEYS.USER_COMPANIES],
    initialData: [],
    queryFn: async () => {
      console.log("fetching companies");
      const authToken = await getTokenCached();
      if (!authToken) {
        return [];
      }

      const sdk = client(env.NEXT_PUBLIC_BACKEND_URL, authToken);
      const req = await sdk.company.$get();

      const body = await req.json();
      if ("error" in body) {
        if (req.status !== 401) {
          toast.error("Something went wrong while fetching your companies", {
            description: body.error,
          });
        }

        return [];
      }

      //TODO: use pageSize when implemented
      return body;
    },
  });
}
