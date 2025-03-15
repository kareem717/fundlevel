import { getAccountAction, getUserAction } from "@/actions/auth";
import { AuthProvider } from "@/components/providers/auth-provider";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = (await getUserAction())?.data;
  const account = (await getAccountAction())?.data;

  if (!user || !account) {
    throw new Error("User or account not found");
  }

  return (
    <AuthProvider user={user} account={account} >
      {/* // <NotificationProvider notifications={notifications}> */}
      {children}
      {/* // </NotificationProvider> */}
    </AuthProvider>
  );
}