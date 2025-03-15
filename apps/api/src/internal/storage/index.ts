/**
 * Storage layer exports
 */

import { IAccountRepository } from "./interfaces/account";
import { AccountRepository } from "./implementaions/account";
import { Client } from "@fundlevel/supabase/types";
import { createClient } from "@supabase/supabase-js";

export class Storage {
  public readonly account: IAccountRepository;
  private readonly sb: Client;
  constructor(supabase: {
    url: string;
    serviceKey: string;
  }) {
    this.sb = createClient(supabase.url, supabase.serviceKey);

    this.account = new AccountRepository(this.sb);
  }
}

export * from "./interfaces";
export * from "./implementaions";