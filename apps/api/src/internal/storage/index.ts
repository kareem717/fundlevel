/**
 * Storage layer exports
 */

import type {
  IAccountRepository,
  ILinkedAccountRepository,
} from "./interfaces";
import { AccountRepository } from "./implementaions/account";
import type { Client } from "@fundlevel/supabase/types";
import { createClient } from "@supabase/supabase-js";
import { LinkedAccountRepository } from "./implementaions/linked-account";
import { env } from "../../env";

export class Storage {
  public readonly account: IAccountRepository;
  public readonly linkedAccount: ILinkedAccountRepository;
  private readonly sb: Client;

  constructor() {
    this.sb = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

    this.account = new AccountRepository(this.sb);
    this.linkedAccount = new LinkedAccountRepository(this.sb);
  }
}

export * from "./interfaces";
export * from "./implementaions";
