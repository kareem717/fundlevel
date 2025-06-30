import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type { accounts } from "../schema";
import type { OmitEntityFields } from "./utils";

export type Account = InferSelectModel<typeof accounts>;
export type CreateAccountParams = OmitEntityFields<
  InferInsertModel<typeof accounts>
>;
export type UpdateAccountParams = Omit<Partial<CreateAccountParams>, "userId">;
