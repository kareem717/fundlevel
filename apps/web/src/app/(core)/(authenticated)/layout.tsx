import { redirect } from "next/navigation";
import { redirects } from "@/lib/config/redirects";
import { getAccountAction, getStripeIdentityAction, getUserAction } from "@/actions/auth";
import { AuthProvider } from "@/components/providers/auth-provider";
import { NotificationProvider, Notification } from "@/components/providers/notification-provider";
import { VerifyIdentityModalButton } from "@/components/stipe/verify-identity-modal-button";

export default async function CoreLayout({ children }: { children: React.ReactNode }) {
  let user
  try {
    const userResponse = await getUserAction();
    user = userResponse?.data
  } catch (error) {
    console.error('Error fetching user data:', error);
  }

  if (!user) {
    redirect(redirects.auth.login);
  }

  let account
  try {
    const accountResponse = await getAccountAction();

    account = accountResponse?.data
  } catch (error) {
    console.error('Error fetching account data:', error);
  }

  if (!account) {
    redirect(redirects.auth.createAccount);
  }

  const identity = await getStripeIdentityAction();

  const notifications: Notification[] = [];

  if (!identity?.data) {
    notifications.push({
      id: "identity-not-verified",
      title: "Verify your identity",
      description: "Please verify your identity to continue",
      action: <VerifyIdentityModalButton />
    });
  }

  return (
    <AuthProvider user={user} account={account}>
      <NotificationProvider notifications={notifications}>
        {children}
      </NotificationProvider>
    </AuthProvider>
  );
}
