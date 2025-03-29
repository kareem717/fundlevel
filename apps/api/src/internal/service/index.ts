import type { Storage } from "@fundlevel/api/internal/storage";
import {
  AuthService,
  CompanyService,
  AccountingService,
  ReconciliationService,
} from "./implementations";
import type {
  IAuthService,
  ICompanyService,
  IAccountingService,
  IReconciliationService,
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
  readonly accounting: IAccountingService;
  readonly reconciliation: IReconciliationService;

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

    this.reconciliation = new ReconciliationService(
      config.storage.banking,
      config.storage.invoice,
      config.openaiKey,
    );
    this.auth = new AuthService(config.storage.account);
    this.company = company;
    this.accounting = accounting;
  }
}

export * from "./interfaces";
export * from "./implementations";
