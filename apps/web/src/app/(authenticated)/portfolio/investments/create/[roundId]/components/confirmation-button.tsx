"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ComponentPropsWithoutRef, FC, useState } from "react";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { useCheckoutFormStore } from "./checkout-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface ConfirmationButtonProps extends ComponentPropsWithoutRef<"div"> {
  prefetchUrl: string;
}

export const ConfirmationButton: FC<ConfirmationButtonProps> = ({ className, prefetchUrl, ...props }) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const { triggerSubmit, error } = useCheckoutFormStore();
  const form = useForm();
  const router = useRouter();

  async function onSubmit() {
    setIsExecuting(true);
    router.prefetch(prefetchUrl);
    await triggerSubmit();
    if (error) {
      toast.error("An error occurred while processing your payment.");
      console.error('error', error.message);
    }
    setIsExecuting(false);
  }

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <p className="text-sm text-foreground">
        By clicking the button below, I agree to the Host&apos;s House Rules, Ground rules for guests, Airbnb&apos;s Rebooking and Refund Policy, and that Airbnb can charge my payment method if I&apos;m responsible for damage. I agree to pay the total amount shown if the Host accepts my booking request.
      </p>
      <Button
        type="submit"
        className="w-min flex justify-center items-center"
        disabled={isExecuting || !form.formState.isValid}
        onClick={onSubmit}
      >
        {isExecuting && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />} Invest
      </Button>
    </div>
  );
};
