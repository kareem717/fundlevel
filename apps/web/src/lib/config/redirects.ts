const appRoot = "/";
export const companyRoot = "/company";

// Helper function moved to top for clarity
const companyPrefix = (id: number, path?: string) =>
  `${companyRoot}/${id}${path ? `/${path}` : ""}`;

export const redirects = {
  compliance: {
    privacy: "/privacy",
    terms: "/terms",
    eula: "/eula",
  },
  auth: {
    callback: (redirect?: string) =>
      redirect ? `/auth-callback?redirect=${redirect}` : "/auth-callback",
    login: "/login",
    logout: "/logout",
    afterLogout: "/login",
    afterLogin: appRoot,
    otp: (email?: string) => `/otp${email ? `?email=${email}` : ""}`,
    createAccount: "/create-account",
    error: (error: string) => `/auth-error?error=${error}`,
  },
  app: {
    company: (id: number) => ({
      root: companyPrefix(id),
      bankAccounts: {
        index: companyPrefix(id, "bank-accounts"),
        show: (accountId: number) =>
          companyPrefix(id, `bank-accounts/${accountId}`),
      },
      invoices: {
        index: companyPrefix(id, "invoices"),
        show: (invoiceId: number) => companyPrefix(id, `invoices/${invoiceId}`),
        reconcile: (invoiceId: number) =>
          companyPrefix(id, `invoices/${invoiceId}/reconcile`),
      },
      settings: {
        root: companyPrefix(id, "settings"),
        general: companyPrefix(id, "settings/general"),
        connections: companyPrefix(id, "settings/connections"),
      },
    }),
    root: appRoot,
  },
};
