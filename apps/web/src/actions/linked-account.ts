"use server";

import { actionClientWithAccount } from "@/lib/safe-action";
import { z } from "zod";

export const createLinkTokenAction = actionClientWithAccount
  .schema(
    z.object({
      name: z.string().min(1),
    }),
  )
  .action(async ({ ctx: { api }, parsedInput: { name } }) => {
    const req = await api["linked-accounts"].link.$get({
      query: {
        name,
      },
    });

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
  .schema(
    z.object({
      publicToken: z.string().min(1),
    }),
  )
  .action(async ({ ctx: { api }, parsedInput: { publicToken } }) => {
    const req = await api["linked-accounts"].swap.$post({
      query: {
        publicToken,
      },
    });

    switch (req.status) {
      case 200:
        return await req.json();
      case 401:
        throw new Error((await req.json()).error);
      default:
        throw new Error("An error occurred");
    }
  });

export const getLinkedAccountByIdAction = actionClientWithAccount
  .schema(z.number().int().positive())
  .action(async ({ ctx: { api }, parsedInput }) => {
    // For path with pattern /{id}, we need to use the dynamic path pattern
    // Create a fake key with the ID to access the endpoint
    // @ts-ignore - This is a workaround for TypeScript dynamic path access
    const req = await api["linked-accounts"][":id"].$get({
      param: {
        id: parsedInput,
      },
    });

    switch (req.status) {
      case 200:
        return await req.json();
      case 401:
        throw new Error((await req.json()).error);
      default:
        throw new Error("An error occurred");
    }
  });

export const getLinkedAccountsAction = actionClientWithAccount.action(
  async ({ ctx: { api } }) => {
    const req = await api["linked-accounts"].list.$get();

    switch (req.status) {
      case 200:
        return await req.json();
      case 401:
        throw new Error((await req.json()).error);
      default:
        throw new Error("An error occurred");
    }
  },
);
