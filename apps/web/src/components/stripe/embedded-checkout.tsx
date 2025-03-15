"use client";

import {
  loadStripe,
  StripeElementsOptions,
  StripeError,
} from "@stripe/stripe-js";
import {
  ComponentPropsWithoutRef,
  useState,
  useImperativeHandle,
  forwardRef,
  use,
} from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { env } from "@/env";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { useTheme } from "next-themes";
import { confirmInvestmentPaymentAction } from "@/actions/investment";
import { usePathname } from "next/navigation";

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export interface EmbeddedCheckoutFormRef {
  submitCheckout: () => Promise<boolean>;
  isLoading: boolean;
}

export interface EmbeddedCheckoutFormProps
  extends ComponentPropsWithoutRef<typeof PaymentElement> {
  amount: number;
  currency: string;
  investmentId: number;
  onError: (msg: string) => void;
  onSuccess: () => void | Promise<void>;
}

export const EmbeddedCheckoutForm = forwardRef<
  EmbeddedCheckoutFormRef,
  EmbeddedCheckoutFormProps
>(({ amount, currency, ...props }, ref) => {
  const { resolvedTheme } = useTheme();

  const options: StripeElementsOptions = {
    appearance: { theme: resolvedTheme === "dark" ? "night" : "flat" },
    loader: "auto",
    paymentMethodCreation: "manual",
    mode: "payment" as const,
    amount: amount,
    currency: currency,
  };

  return (
    <Elements options={options} stripe={stripePromise}>
      <CheckoutForm ref={ref} {...props} />
    </Elements>
  );
});

EmbeddedCheckoutForm.displayName = "EmbeddedCheckoutForm";

interface CheckoutFormProps
  extends ComponentPropsWithoutRef<typeof PaymentElement> {
  investmentId: number;
  onError: (msg: string) => void;
  onSuccess: () => void | Promise<void>;
}

const CheckoutForm = forwardRef<EmbeddedCheckoutFormRef, CheckoutFormProps>(
  ({ investmentId, onError, onSuccess, ...props }, ref) => {
    const [isLoading, setIsLoading] = useState(false);
    const stripe = useStripe();
    const elements = useElements();
    const { toast } = useToast();
    const returnURL = env.NEXT_PUBLIC_APP_URL + usePathname();

    const submitCheckout = async (): Promise<boolean> => {
      if (!stripe || !elements) return false;

      setIsLoading(true);

      // Trigger form validation and wallet collection
      const { error: submitError } = await elements.submit();
      if (submitError) {
        onError(submitError.message ?? "Failed to submit form");
        setIsLoading(false);
        return false;
      }

      // Create the ConfirmationToken using the details collected by the Payment Element
      // and additional shipping information
      const { error, confirmationToken } = await stripe.createConfirmationToken(
        {
          elements,
        },
      );

      if (error) {
        onError(error.message ?? "Failed to create confirmation token");
        setIsLoading(false);
        return false;
      }

      const confirmation = (
        await confirmInvestmentPaymentAction({
          id: investmentId,
          confirmationToken: confirmationToken.id,
          returnURL,
        })
      )?.data;

      if (!confirmation) {
        onError("Failed to confirm payment");
        setIsLoading(false);
        return false;
      }

      if (confirmation.status === "requires_action") {
        const { error } = await stripe.handleNextAction({
          clientSecret: confirmation.client_secret,
        });

        if (error) {
          onError(error.message ?? "Failed to handle next action");
          setIsLoading(false);
          return false;
        }
      }

      //TODO: confirm intent
      toast({
        title: "Payment successful",
        description: "Your payment has been processed successfully.",
      });

      await onSuccess();
      setIsLoading(false);
      return true;
    };

    useImperativeHandle(ref, () => ({
      submitCheckout,
      isLoading,
    }));

    if (!stripe || !elements) {
      return null;
    }

    return (
      <PaymentElement
        id="payment-element"
        options={{ layout: "tabs" }}
        {...props}
      />
    );
  },
);

CheckoutForm.displayName = "CheckoutForm";
