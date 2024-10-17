import { redirect } from "next/navigation";
import redirects from "@/lib/config/redirects";
import AuthProvider from "@/components/providers/auth-provider";
import { getAccount, getUser } from "@/actions/auth";
import { DashboardHeader } from "./components/dashboard-header";

export default async function DashboardLayout({
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
    <AuthProvider user={userResponse.data} account={accountResponse?.data}>
      <div className="w-full h-full relative">
        <DashboardHeader
          account={accountResponse.data}
          className="fixed top-0 left-0 w-full z-50 bg-background border-b max-h-20"
        />
        <div className="pt-20">
          {children}
        </div>
      </div>
    </AuthProvider>
  );
}
