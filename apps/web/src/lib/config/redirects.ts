const appRoot = "/";
export const companyRoot = "/company";

// Helper function moved to top for clarity
const companyPrefix = (id: number, path?: string) =>
  `${appRoot}/${companyRoot}/${id}${path ? `/${path}` : ""}`;

// Helper to reduce repetition in business dashboard paths
const companyPath = (id: number) => ({
  root: () => companyPrefix(id),
  path: (suffix: string) => companyPrefix(id, suffix),
});

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
      root: `${companyRoot}/${id}`,
    }),
    root: appRoot,
  },
};
