import type { Storage } from "@fundlevel/api/internal/storage";
import {
  AuthService,
  CompanyService,
  AIService,
  AccountingService,
} from "./implementations";
import type {
  IAuthService,
  ICompanyService,
  IAIService,
  IAccountingService,
} from "./interfaces";
import type { QuickBooksConfig, PlaidConfig } from "./implementations/company";

type ServiceConfig = {
  storage: Storage;
  qbConfig: QuickBooksConfig;
  plaidConfig: PlaidConfig;
  openaiKey: string;
};

export class Service {
  readonly auth: IAuthService;
  readonly company: ICompanyService;
  readonly ai: IAIService;
  readonly accounting: IAccountingService;

  constructor(config: ServiceConfig) {
    const company = new CompanyService(
      config.storage,
      config.plaidConfig,
      config.qbConfig,
    );
    const accounting = new AccountingService(
      config.storage,
      company,
      config.qbConfig.environment,
    );

    this.auth = new AuthService(config.storage.account);
    this.company = company;
    this.accounting = accounting;
    this.ai = new AIService(accounting, config.openaiKey);
  }
}

export * from "./interfaces";
export * from "./implementations";
