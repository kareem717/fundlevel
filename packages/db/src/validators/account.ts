import {
  createSelectSchema,
  createUpdateSchema,
  createInsertSchema,
} from "drizzle-zod";
import { accounts } from "@fundlevel/db/schema";

export const AccountSchema = createSelectSchema(accounts);

export const CreateAccountParamsSchema = createInsertSchema(accounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
});

export const UpdateAccountParamsSchema = createUpdateSchema(accounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
});
