"use client";

import { getStripeIdentitySessionAction } from "@/actions/auth";
import { env } from "@/env";
import { Button } from "@workspace/ui/components/button";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { useAction } from "next-safe-action/hooks";
import { ComponentPropsWithoutRef, useEffect } from "react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { ToastAction } from "@workspace/ui/components/toast";
import { usePathname } from "next/navigation";
import { useNotification } from "../providers/notification-provider";

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export function VerifyIdentityModalButton({
  onClick,
  ...props
}: Omit<ComponentPropsWithoutRef<typeof Button>, "role">) {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const notificationContext = useNotification();
  const currentUrl = env.NEXT_PUBLIC_APP_URL + usePathname();
  const { executeAsync: getClientSecret } = useAction(
    getStripeIdentitySessionAction,
  );

  // Initialize Stripe once
  useEffect(() => {
    stripePromise.then(setStripe);
  }, []);

  async function handleOnClick(e: any) {
    if (!stripe) return;

    setIsLoading(true);

    try {
      const resp = await getClientSecret(currentUrl);
      if (!resp?.data?.client_secret) {
        throw new Error("Missing client secret");
      }

      const { error } = await stripe.verifyIdentity(resp.data.client_secret);
      if (error) throw error;
    } catch {
      toast({
        title: "Verification Failed",
        description:
          "We couldn't start identity verification. Please try again.",
        variant: "destructive",
        action: (
          <ToastAction altText="Try again" onClick={handleOnClick}>
            Try again
          </ToastAction>
        ),
      });
    } finally {
      notificationContext?.removeNotification("identity-not-verified");
      setIsLoading(false);
      onClick?.(e);
    }
  }

  return (
    <Button
      disabled={!stripe || props.disabled || isLoading}
      role="link"
      onClick={(e) => handleOnClick(e)}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      Verify
    </Button>
  );
}
