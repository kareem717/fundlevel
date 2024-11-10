"use client";

import { Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { ConfirmPaymentData, loadStripe, StripeElementsOptions, StripeError, StripePaymentElementOptions } from '@stripe/stripe-js';
import { PaymentElement } from '@stripe/react-stripe-js';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { create } from 'zustand';
import { useTheme } from 'next-themes';
import { env } from '@/env';
import { useAction } from 'next-safe-action/hooks';
import { createInvestmentPaymentIntent } from '@/actions/investments';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface CheckoutFormState {
  isExecuting: boolean;
  isStripeLoaded: boolean;
  error: StripeError | null;
  triggerSubmit: () => void;
  setExecuting: (executing: boolean) => void;
  setStripeLoaded: (loaded: boolean) => void;
  setError: (error: StripeError) => void;
}

export const useCheckoutFormStore = create<CheckoutFormState>((set) => ({
  isExecuting: false,
  isStripeLoaded: false,
  error: null,
  triggerSubmit: () => Promise<void>,
  setExecuting: (executing: boolean) => set({ isExecuting: executing }),
  setStripeLoaded: (loaded: boolean) => set({ isStripeLoaded: loaded }),
  setError: (error: StripeError) => set({ error: error }),
}));

export const FormContent = ({ confirmParams, redirect }: { confirmParams: ConfirmPaymentData, redirect?: 'always' }) => {
  const stripe = useStripe();
  const elements = useElements();
  const {
    setExecuting,
    setStripeLoaded,
    setError,
  } = useCheckoutFormStore();

  useEffect(() => {
    setStripeLoaded(!!stripe && !!elements);
  }, [stripe, elements, setStripeLoaded]);

  const paymentElementOptions: StripePaymentElementOptions = useMemo(() => ({
    layout: 'tabs',
  }), []);

  const handleSubmit = useCallback(async () => {
    // For some reason, we can't use the isStripeLoaded state here, so we need to check stripe and elements directly
    if (!stripe || !elements) {
      return;
    }

    setExecuting(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams,
      redirect,
    });

    setExecuting(false);

    if (error) {
      setError(error);
    }
  }, [stripe, elements, confirmParams, redirect, setExecuting, setError]);

  useEffect(() => {
    useCheckoutFormStore.setState({
      triggerSubmit: handleSubmit
    });
  }, [handleSubmit]);  // Add handleSubmit to dependencies

  return (
    <PaymentElement id="payment-element" options={paymentElementOptions} />
  );
};

export interface CheckoutFormProps {
  roundId: number;
  confirmParams: ConfirmPaymentData;
  redirect?: 'always';
}

export const CheckoutForm: FC<CheckoutFormProps> = ({
  roundId,
  confirmParams,
  redirect,
}) => {
  const [clientSecret, setClientSecret] = useState<string>();
  const { resolvedTheme } = useTheme();
  const stripePromise = useMemo(() => loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY), []);
  const { executeAsync: createPaymentIntent, isExecuting } = useAction(createInvestmentPaymentIntent, {
    onSuccess: ({ data }) => {
      if (!data?.clientSecret) throw new Error('Failed to create a payment intent');

      setClientSecret(data.clientSecret);
    },
  });

  useEffect(() => {
    createPaymentIntent(roundId);
  }, [createPaymentIntent, roundId]);

  if (isExecuting) return (
    <div className="grid grid-rows-3 gap-4 [&>*]:h-10 [&>*]:w-full">
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="size-full" />
        <Skeleton className="size-full" />
      </div>
      <Skeleton className="size-full" />
      <Skeleton className="size-full" />
    </div>
  )


  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: resolvedTheme === 'dark' ? 'night' : 'flat',
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <FormContent confirmParams={confirmParams} redirect={redirect} />
    </Elements>
  );
};