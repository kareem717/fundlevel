import { client } from "@fundlevel/sdk";
import { useQuery } from "@tanstack/react-query";
import { getTokenCached } from "../actions/auth";
import { env } from "../env";

export function useLinkedTransactions(
  type: "invoice" | "bill",
  id: number,
  pagination: {
    page: number;
    pageSize: number;
    order: "asc" | "desc";
    sortBy: "date" | "id";
  }
) {
  return useQuery({
    queryKey: ["transactions", type === "bill" ? "bill" : "invoice", id, pagination],
    queryFn: async () => {
      const token = await getTokenCached();
      if (!token) {
        throw new Error("No authentication token found");
      }

      let req = null

      switch (type) {
        case "invoice":
          req = await client(env.NEXT_PUBLIC_BACKEND_URL, token)["bank-transaction"].invoice[":invoiceId"].$get({
            param: { invoiceId: id },
            query: pagination,
          });
          break;
        case "bill":
          req = await client(env.NEXT_PUBLIC_BACKEND_URL, token)["bank-transaction"].bill[":billId"].$get({
            param: { billId: id },
            query: pagination,
          });
          break;
        default:
          throw new Error("Invalid transaction type");
      }

      if (!req.ok) {
        throw new Error("Failed to get related transactions");
      }

      return await req.json();
    },
  });
}