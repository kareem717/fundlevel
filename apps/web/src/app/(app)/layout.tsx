import { redirect } from "next/navigation";
import redirects from "@/lib/config/redirects";
import AuthProvider from "@/components/providers/auth-provider";
import createClient from "@/lib/utils/supabase/server";
import { getAccount, getUser } from "@/actions/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userResponse = await getUser();
  if (!userResponse?.data) {
    redirect(redirects.auth.login);
  }

  const accountResponse = await getAccount();
  if (!accountResponse?.data) {
    redirect(redirects.auth.createAccount);
  }

  return (
    <AuthProvider user={userResponse.data} account={accountResponse.data}>
      {children}
    </AuthProvider>
  );
}
