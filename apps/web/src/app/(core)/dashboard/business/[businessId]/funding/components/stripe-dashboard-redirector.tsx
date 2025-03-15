"use client";

import { getStripeDashboardUrlAction } from '@/actions/business';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { ComponentPropsWithoutRef, useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { BusinessStripeAccount } from '@workspace/sdk';
import { useToast } from '@workspace/ui/hooks/use-toast'
import { ToastAction } from '@workspace/ui/components/toast';
import { Loader2 } from 'lucide-react';

interface StripeDashboardRedirectorProps extends ComponentPropsWithoutRef<typeof Button> {
  stripeAccount: BusinessStripeAccount;
  businessId: number;
}

export function StripeDashboardRedirector({ className, businessId, ...props }: StripeDashboardRedirectorProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { executeAsync, hasErrored } = useAction(getStripeDashboardUrlAction);

  const handleClick = async () => {
    setIsLoading(true);

    const resp = await executeAsync(businessId);

    if (resp?.data?.url) {
      router.push(resp.data.url);
    } else {
      setIsLoading(false);
      //TODO: handle better
      if (hasErrored) { console.log(resp); }

      toast({
        title: "Failed to get Stripe dashboard link",
        description: "An unknown error occurred",
        variant: "destructive",
        action: (
          <ToastAction
            altText="Retry"
            onClick={() => handleClick()}
          >
            Retry
          </ToastAction>
        )
      });
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      role='link'
    >
      {isLoading && <Loader2 className="mr-2 animate-spin" />}
      Go to Stripe Dashboard
    </Button>
  );
};
