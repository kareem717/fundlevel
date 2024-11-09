"use client";

import { Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { ConfirmPaymentData, loadStripe, StripeElementsOptions, StripeError, StripePaymentElementOptions } from '@stripe/stripe-js';
import { PaymentElement } from '@stripe/react-stripe-js';
import { FC, useCallback, useEffect, useMemo } from 'react';
import { create } from 'zustand';
import { useTheme } from 'next-themes';

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

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    alert('submit');

    setExecuting(false);

    if (error) {
      setError(error);
    }
  }, [stripe, elements, confirmParams, redirect, setExecuting, setError]);

  useEffect(() => {
    useCheckoutFormStore.setState({
      triggerSubmit: () => handleSubmit(new Event('submit') as any)
    });
  }, [handleSubmit]);  // Add handleSubmit to dependencies

  return (
    <PaymentElement id="payment-element" options={paymentElementOptions} />
  );
};

export interface CheckoutFormProps {
  clientSecret: string;
  publishableKey: string;
  confirmParams: ConfirmPaymentData;
  redirect?: 'always';
}

export const CheckoutForm: FC<CheckoutFormProps> = ({
  clientSecret,
  publishableKey,
  confirmParams,
  redirect,
}) => {
  const { resolvedTheme } = useTheme();
  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: resolvedTheme === 'dark' ? 'night' : 'flat',
    },
  };

  const stripePromise = useMemo(() => loadStripe(publishableKey), [publishableKey]);

  return (
    <Elements stripe={stripePromise} options={options}>
      <FormContent confirmParams={confirmParams} redirect={redirect} />
    </Elements>
  );
};