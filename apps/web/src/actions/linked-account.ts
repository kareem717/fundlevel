"use server";

import { actionClientWithAccount } from "@/lib/safe-action";
import { createLinkedAccounttSchema } from "@fundlevel/api/types";
import { z } from "zod";

export const createMergeLinkTokenAction = actionClientWithAccount
  .schema(z.number().int().positive())
  .action(async ({ ctx: { api }, parsedInput }) => {
    const req = await api["linked-accounts"][":id"].link.merge.$get({
      param: {
        id: parsedInput,
      },
    });

    switch (req.status) {
      case 200:
        return await req.json();
      case 401:
      case 403:
        throw new Error((await req.json()).error);
      default:
        throw new Error("An error occurred");
    }
  });

export const createPlaidLinkTokenAction = actionClientWithAccount
  .schema(z.number().int().positive())
  .action(async ({ ctx: { api }, parsedInput }) => {
    const req = await api["linked-accounts"][":id"].link.plaid.$get({
      param: {
        id: parsedInput,
      },
    });

    switch (req.status) {
      case 200:
        return await req.json();
      case 401:
      case 403:
        throw new Error((await req.json()).error);
      default:
        throw new Error("An error occurred");
    }
  });

export const swapPlaidPublicTokenAction = actionClientWithAccount
  .schema(z.object({
    linkedAccountId: z.number().int().positive(),
    publicToken: z.string(),
  })).action(async ({ ctx: { api }, parsedInput }) => {

    const req = await api["linked-accounts"][":id"].credentials.plaid.$post({
      param: {
        id: parsedInput.linkedAccountId,
      },
      query: {
        public_token: parsedInput.publicToken,
      },
    })

    switch (req.status) {
      case 201:
        return await req.json();
      case 401:
      case 403:
      case 404:
        throw new Error((await req.json()).error);
      default:
        throw new Error("An error occurred");
    }
  })
  

export const createLinkedAccountAction = actionClientWithAccount
  .schema(createLinkedAccounttSchema)
  .action(async ({ ctx: { api }, parsedInput }) => {
    const req = await api["linked-accounts"].$post({
      json: parsedInput,
    });

    switch (req.status) {
      case 201:
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
