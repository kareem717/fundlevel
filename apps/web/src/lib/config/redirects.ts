const appRoot = "/dashboard";
const businessDashboardRoot = "/business";

// Helper function moved to top for clarity
const businessPrefix = (businessId: number, path?: string) =>
  `${appRoot}/${businessDashboardRoot}/${businessId}${path ? `/${path}` : ""}`;

// Helper to reduce repetition in business dashboard paths
const businessPath = (businessId: number) => ({
  root: () => businessPrefix(businessId),
  path: (suffix: string) => businessPrefix(businessId, suffix),
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
    error: (error: string) => `/error?error=${error}`,
  },
  app: {
    root: appRoot,
  },
};
