import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../lib/config/query-keys";
import { client } from "@fundlevel/sdk";
import { env } from "../env";
import { getTokenCached } from "../actions/auth";
import { toast } from "@fundlevel/ui/components/sonner";

const EMPTY_RESULT = {
  data: [],
  totalPages: 0,
  totalRecords: 0,
  hasNextPage: false,
  hasPreviousPage: false,
  currentPage: 0,
}

export function useCompanies(
  query: {
    searchQuery?: string,
    page?: number,
    pageSize?: number,
    sortBy?: "createdAt" | "id",
    order?: "asc" | "desc"
  }
) {
  return useQuery({
    queryKey: [QUERY_KEYS.USER_COMPANIES, ...Object.values(query)],
    initialData: EMPTY_RESULT,
    queryFn: async () => {
      const authToken = await getTokenCached();
      if (!authToken) {
        return EMPTY_RESULT;
      }

      const sdk = client(env.NEXT_PUBLIC_BACKEND_URL, authToken);
      const req = await sdk.company.$get({
        query
      });

      const body = await req.json();
      if ("error" in body) {
        if (req.status !== 401) {
          toast.error("Something went wrong while fetching your companies", {
            description: body.error,
          });
        }

        return EMPTY_RESULT;
      }

      //TODO: use pageSize when implemented
      return body;
    },
  });
}