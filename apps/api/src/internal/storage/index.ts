import type {
  IAccountRepository,
  ICompanyRepository,
} from "./interfaces";
import type { Client } from "@fundlevel/supabase/types";
import { createClient } from "@supabase/supabase-js";
import { CompanyRepository, AccountRepository } from "./implementaions";
import { env } from "../../env";

export class Storage {
  public readonly account: IAccountRepository;
  public readonly company: ICompanyRepository;

  private readonly sb: Client;

  constructor() {
    this.sb = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

    this.account = new AccountRepository(this.sb);
    this.company = new CompanyRepository(this.sb);
  }
}

export * from "./interfaces";
export * from "./implementaions";
