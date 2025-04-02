import { AuthProvider } from "@fundlevel/web/components/providers/auth-provider";
import { redirects } from "@fundlevel/web/lib/config/redirects";
import { redirect } from "next/navigation";
import type { Account } from "@fundlevel/db/types";
import { getTokenCached, getAccountCached } from "../../actions/auth";
import { env } from "@fundlevel/web/env";
import { Badge } from "@fundlevel/ui/components/badge";

export default async function DashboardLayout({
  children,
}: { children: React.ReactNode }) {
  const token = await getTokenCached();
  if (!token) {
    redirect(redirects.auth.login);
  }

  if (env.NODE_ENV === "development") {
    console.log("Token", token);
  }

  let account: Account | null = null;
  try {
    account = await getAccountCached(token);

    if (!account) {
      redirect(redirects.auth.createAccount);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }

  return (
    <AuthProvider account={account} authToken={token}>
      <div className="relative">
        <Badge className="absolute top-6 right-6 z-1000">BETA</Badge>
        {/* // <NotificationProvider notifications={notifications}> */}
        {children}
        {/* // </NotificationProvider> */}
      </div>
    </AuthProvider>
  );
}
