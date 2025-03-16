"use server";

import { env } from "@/env";
import { actionClientWithAccount } from "@/lib/safe-action";
import { createCompanytSchema } from "@fundlevel/api/types";
import { z } from "zod";

export const getQuickBooksAuthUrlAction = actionClientWithAccount
  .schema(z.number().int().positive())
  .action(async ({ ctx: { api }, parsedInput }) => {
    const req = await api["companies"][":id"].quickbooks.connect.$get({
      param: {
        id: parsedInput,
      },
      query: {
        redirect_uri: env.NEXT_PUBLIC_APP_URL,
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

export const createPlaidLinkTokenAction = actionClientWithAccount
  .schema(z.number().int().positive())
  .action(async ({ ctx: { api }, parsedInput }) => {
    const req = await api["companies"][":id"].link.plaid.$get({
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
  .schema(
    z.object({
      companyId: z.number().int().positive(),
      publicToken: z.string(),
    }),
  )
  .action(async ({ ctx: { api }, parsedInput }) => {
    const req = await api["companies"][":id"].credentials.plaid.$post({
      param: {
        id: parsedInput.companyId,
      },
      query: {
        public_token: parsedInput.publicToken,
      },
    });

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
  });

export const createCompanyAction = actionClientWithAccount
  .schema(createCompanytSchema)
  .action(async ({ ctx: { api }, parsedInput }) => {
    const req = await api["companies"].$post({
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

export const getCompanyByIdAction = actionClientWithAccount
  .schema(z.number().int().positive())
  .action(async ({ ctx: { api }, parsedInput }) => {
    const req = await api["companies"][":id"].$get({
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

export const getCompaniesAction = actionClientWithAccount.action(
  async ({ ctx: { api } }) => {
    const req = await api["companies"].list.$get();

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
