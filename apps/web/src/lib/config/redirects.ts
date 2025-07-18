export const redirects = {
	auth: {
		signIn: "/sign-in",
		signOut: "/sign-out",
	},
	app: {
		index: "/",
		integrations: "/integrations",
		bankStatements: {
			view: (id: number) => `/bank-statements/${id}`,
			index: "/bank-statements",
		},
	},
};
