"use client";

import { LegalContainer } from "@/components/legal-container";
import { EmbeddedCheckoutForm } from "@/components/stripe/embedded-checkout";
import { Button } from "@workspace/ui/components/button";
import { useToast } from "@workspace/ui/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { ComponentPropsWithoutRef, useRef, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { EmbeddedCheckoutFormRef } from "@/components/stripe/embedded-checkout";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export interface CheckoutModalProps
  extends ComponentPropsWithoutRef<typeof Dialog> {
  investmentId: number;
  amount: number;
  currency: string;
  triggerText?: string;
}

export function CheckoutModal({
  investmentId,
  amount,
  currency,
  triggerText = "Checkout",
  ...props
}: CheckoutModalProps) {
  const { toast } = useToast();
  const checkoutFormRef = useRef<EmbeddedCheckoutFormRef>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen} {...props}>
      <DialogTrigger>{triggerText}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>
            Complete your investment by paying the required amount.
          </DialogDescription>
        </DialogHeader>
        <LegalContainer>
          <span className="text-sm text-muted-foreground">
            You will be charged{" "}
            {formatCurrency(amount / 100, currency, "en-US")} USD
          </span>
          <EmbeddedCheckoutForm
            amount={amount}
            currency={currency}
            investmentId={investmentId}
            onError={(msg) => {
              toast({
                title: "Uh oh! Something went wrong.",
                description: msg,
                variant: "destructive",
              });
            }}
            onSuccess={() => {
              toast({
                title: "Investment completed!",
                description: "Your investment has been completed.",
              });
              setOpen(false);
              router.refresh();
            }}
            ref={checkoutFormRef}
          />
          <Button
            type="button"
            onClick={() => checkoutFormRef.current?.submitCheckout()}
            disabled={checkoutFormRef.current?.isLoading}
          >
            {checkoutFormRef.current?.isLoading && (
              <Loader2 className="size-4 mr-2 animate-spin" />
            )}
            Checkout
          </Button>
        </LegalContainer>
      </DialogContent>
    </Dialog>
  );
}
