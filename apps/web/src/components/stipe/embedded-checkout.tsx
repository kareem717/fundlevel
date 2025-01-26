'use client';

import { loadStripe } from '@stripe/stripe-js';
import { ComponentPropsWithoutRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements
} from "@stripe/react-stripe-js";
import { env } from '@/env';
import { cn } from '@repo/ui/lib/utils';
import { useToast } from '@repo/ui/hooks/use-toast';
import { useTheme } from 'next-themes';

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export interface EmbeddedCheckoutFormRef {
  submitCheckout: () => Promise<boolean>;
  isLoading: boolean;
}

export interface EmbeddedCheckoutFormProps extends ComponentPropsWithoutRef<typeof PaymentElement> {
  investmentIntentId: string;
}

export const EmbeddedCheckoutForm = forwardRef<EmbeddedCheckoutFormRef, EmbeddedCheckoutFormProps>(({ ...props }, ref) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    //TODO: Implement actual fetchClientSecret
    setClientSecret("pi_3QlcSCAR1zmISRQV2MuN5mSv_secret_9kQYRorJBt2wUUbk0vc5VpiVc")
  }, []);

  if (!clientSecret) {
    return null;
  }

  return (
    <Elements options={{ clientSecret, appearance: { theme: resolvedTheme === "dark" ? "night" : "flat" }, loader: "auto" }} stripe={stripePromise}>
      <CheckoutForm ref={ref} {...props} />
    </Elements>
  )
});

EmbeddedCheckoutForm.displayName = "EmbeddedCheckoutForm";

const CheckoutForm = forwardRef<EmbeddedCheckoutFormRef, EmbeddedCheckoutFormProps>(({ options, ...props }, ref) => {
  const [isLoading, setIsLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();

  async function submitCheckout(): Promise<boolean> {
    setIsLoading(true);

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      setIsLoading(false);
      return false;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // TODO: Make sure to change this to your payment completion page
        return_url: "http://localhost:3000/complete",
      },
    });

    if (error) {
      console.error(error);
      setIsLoading(false);
      return false;
    }

    toast({
      title: "Payment successful",
      description: "Your payment has been processed successfully.",
    });

    setIsLoading(false);
    return true;
  }

  useImperativeHandle(ref, () => ({
    submitCheckout,
    isLoading
  }));

  return (
    <PaymentElement id="payment-element" options={{ layout: "tabs", ...options }} {...props} />
  )
});

CheckoutForm.displayName = "CheckoutForm";
