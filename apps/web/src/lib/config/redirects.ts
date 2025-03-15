const appRoot = "/dashboard";
const linkedAccountRoot = "/linked-account";

// Helper function moved to top for clarity
const linkedAccountPrefix = (id: number, path?: string) =>
	`${appRoot}/${linkedAccountRoot}/${id}${path ? `/${path}` : ""}`;

// Helper to reduce repetition in business dashboard paths
const linkedAccountPath = (id: number) => ({
	root: () => linkedAccountPrefix(id),
	path: (suffix: string) => linkedAccountPrefix(id, suffix),
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
    linkedAccount: (id: number) => ({
			root: linkedAccountPath(id).root(),
		}),
    root: appRoot,
  },
};
