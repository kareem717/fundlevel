import { getMiddlewareAuthAction, getStripeIdentityAction } from "@/actions/auth";
import { AuthProvider } from "@/components/providers/auth-provider";
import { NotificationProvider, Notification } from "@/components/providers/notification-provider";
import { VerifyIdentityModalButton } from "@/components/stripe/verify-identity-modal-button";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, account } = await getMiddlewareAuthAction();

  if (!user || !account) {
    throw new Error("User or account not found");
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
