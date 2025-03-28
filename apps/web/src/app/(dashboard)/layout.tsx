import { AuthProvider } from "@fundlevel/web/components/providers/auth-provider";
import { redirects } from "@fundlevel/web/lib/config/redirects";
import { redirect } from "next/navigation";
import type { Account } from "@fundlevel/db/types";
import { getTokenCached, getAccountCached } from "../../actions/auth";

export default async function DashboardLayout({
  children,
}: { children: React.ReactNode }) {
  const token = await getTokenCached();
  if (!token) {
    redirect(redirects.auth.login);
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
      {/* // <NotificationProvider notifications={notifications}> */}
      {children}
      {/* // </NotificationProvider> */}
    </AuthProvider>
  );
}
