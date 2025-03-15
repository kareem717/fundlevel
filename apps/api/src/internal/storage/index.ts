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

export class Storage {
  public readonly account: IAccountRepository;
  public readonly linkedAccount: ILinkedAccountRepository;
  private readonly sb: Client;

  constructor(supabase: {
    url: string;
    serviceKey: string;
  }) {
    this.sb = createClient(supabase.url, supabase.serviceKey);

    this.account = new AccountRepository(this.sb);
    this.linkedAccount = new LinkedAccountRepository(this.sb);
  }
}

export * from "./interfaces";
export * from "./implementaions";
