'use client';

import { loadStripe, StripeError } from '@stripe/stripe-js';
import { ComponentPropsWithoutRef, useState, useImperativeHandle, forwardRef, use } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements
} from "@stripe/react-stripe-js";
import { env } from '@/env';
import { useToast } from '@repo/ui/hooks/use-toast';
import { useTheme } from 'next-themes';
import { redirects } from '@/lib/config/redirects';

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export interface EmbeddedCheckoutFormRef {
  submitCheckout: () => Promise<StripeError | null>;
  isLoading: boolean;
}

export interface EmbeddedCheckoutFormProps extends ComponentPropsWithoutRef<typeof PaymentElement> {
  clientSecret: string | null;
}

export const EmbeddedCheckoutForm = forwardRef<EmbeddedCheckoutFormRef, EmbeddedCheckoutFormProps>(({ clientSecret, ...props }, ref) => {
  const { resolvedTheme } = useTheme();

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

const CheckoutForm = forwardRef<EmbeddedCheckoutFormRef, Omit<EmbeddedCheckoutFormProps, "clientSecret">>(({ options, ...props }, ref) => {
  const [isLoading, setIsLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();

  const submitCheckout = async (): Promise<StripeError | null> => {
    if (!stripe || !elements) return null;
    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: process.env.NODE_ENV === "development" ? "https://fundlevel.app/wallet" : env.NEXT_PUBLIC_APP_URL + redirects.app.wallet
      },
      redirect: "if_required"
    });

    if (error) {
      console.error(error);
      setIsLoading(false);
      return error;
    }

    toast({
      title: "Payment successful",
      description: "Your payment has been processed successfully.",
    });

    setIsLoading(false);
    return null;
  };

  useImperativeHandle(ref, () => ({
    submitCheckout,
    isLoading
  }));

  if (!stripe || !elements) {
    return null;
  }

  return (
    <PaymentElement id="payment-element" options={{ layout: "tabs", ...options }} {...props} />
  )
});

CheckoutForm.displayName = "CheckoutForm";
