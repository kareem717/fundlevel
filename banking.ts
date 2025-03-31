async getManyTransactions(
  filter: GetManyTransactionsFilter,
): Promise < OffsetPaginationResult < BankAccountTransaction >> {
  const countQb = this.db
    .select({
      total: count(),
    })
    .from(bankAccountTransactions)
    .where(and(
      filter.minDate ? gte(bankAccountTransactions.date, filter.minDate) : undefined,
      filter.maxDate ? lte(bankAccountTransactions.date, filter.maxDate) : undefined,
      filter.minAmount ? gte(bankAccountTransactions.amount, filter.minAmount) : undefined,
      filter.maxAmount ? lte(bankAccountTransactions.amount, filter.maxAmount) : undefined,
      filter.bankAccountIds ? inArray(bankAccountTransactions.bankAccountId, filter.bankAccountIds) : undefined,
      filter.companyIds ? inArray(bankAccountTransactions.companyId, filter.companyIds) : undefined,
    ));

  const { page, pageSize, order } = filter;
  const qb = this.db
    .select()
    .from(bankAccountTransactions)
    .where(and(
      filter.minDate ? gte(bankAccountTransactions.date, filter.minDate) : undefined,
      filter.maxDate ? lte(bankAccountTransactions.date, filter.maxDate) : undefined,
      filter.minAmount ? gte(bankAccountTransactions.amount, filter.minAmount) : undefined,
      filter.maxAmount ? lte(bankAccountTransactions.amount, filter.maxAmount) : undefined,
      filter.bankAccountIds ? inArray(bankAccountTransactions.bankAccountId, filter.bankAccountIds) : undefined,
      filter.companyIds ? inArray(bankAccountTransactions.companyId, filter.companyIds) : undefined,
    ))
    // ... existing code ...

async getManyBankAccounts(filter: GetManyBankAccountsFilter) {
    const { page, pageSize, order } = filter;

    const qb = this.db
      .select()
      .from(bankAccounts)
      .where(filter.companyIds ? inArray(bankAccounts.companyId, filter.companyIds) : undefined)
      .groupBy(bankAccounts.remoteId)
      .limit(pageSize)
      .offset(page * pageSize)
      .orderBy(order === "asc" ? asc(bankAccounts.remoteId) : desc(bankAccounts.remoteId));

    const countQb = this.db
      .select({
        total: count(),
      })
      .from(bankAccounts)
      .where(filter.companyIds ? inArray(bankAccounts.companyId, filter.companyIds) : undefined);
    // ... existing code ...
  } 