"use server"

import { actionClientWithAccount } from "@/lib/safe-action";
import { z } from "zod";

export const createLinkTokenAction = actionClientWithAccount
  .schema(z.object({
    name: z.string().min(1),
  }))
  .action(async ({ ctx: { api }, parsedInput: { name } }) => {

    const req = await api["linked-accounts"].link.$get({
      query: {
        name,
      },
    })

    switch (req.status) {
      case 200:
        return await req.json();
      case 401:
        throw new Error((await req.json()).error);
      default:
        throw new Error("An error occurred");
    }
  });

  
export const swapPublicTokenAction = actionClientWithAccount
.schema(z.object({
  publicToken: z.string().min(1),
}))
.action(async ({ ctx: { api }, parsedInput: { publicToken } }) => {

  const req = await api["linked-accounts"].swap.$post({
    query: {
      publicToken,
    },
  })

  switch (req.status) {
    case 200:
      return await req.json();
    case 401:
      throw new Error((await req.json()).error);
    default:
      throw new Error("An error occurred");
  }
});

