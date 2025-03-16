const appRoot = "/";
export const companyRoot = "/company";

// Helper function moved to top for clarity
const companyPrefix = (id: number, path?: string) =>
  `${companyRoot}/${id}${path ? `/${path}` : ""}`;

export const redirects = {
  legal: {
    privacy: "/privacy",
    terms: "/terms",
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
      reconciliation: companyPrefix(id, "reconciliation"),
    }),
    root: appRoot,
  },
};
