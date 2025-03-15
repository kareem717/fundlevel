"use client";

import { getStripeAccountSettingsLink } from '@/actions/business';
import { useAction } from 'next-safe-action/hooks';
import { usePathname, useRouter } from 'next/navigation';
import { ComponentPropsWithoutRef, useState } from 'react';
import { useToast } from '@workspace/ui/hooks/use-toast';
import { Button } from '@workspace/ui/components/button';
import { env } from '@/env';
import { ToastAction } from '@workspace/ui/components/toast';
import { Loader2 } from 'lucide-react';

export interface StripeOnboardRedirectorProps extends ComponentPropsWithoutRef<'button'> {
  text?: string;
  businessId: number;
}

export function StripeOnboardRedirector({ className, text, businessId, ...props }: StripeOnboardRedirectorProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const currentUrl = env.NEXT_PUBLIC_APP_URL + usePathname();

  const { executeAsync, hasErrored } = useAction(getStripeAccountSettingsLink)

  const handleClick = async () => {
    setIsLoading(true);

    const resp = await executeAsync({
      id: businessId,
      refreshURL: currentUrl,
      returnURL: currentUrl,
    });

    if (resp?.data?.url) {
      router.push(resp.data.url);
    } else {
      setIsLoading(false);
      //TODO: handle better
      if (hasErrored) { console.log(resp); }

      toast({
        title: "Failed to get Stripe onboarding link",
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
      disabled={isLoading}
      onClick={handleClick}
      className={className}
      {...props}
      role='link'
    >
      {isLoading && <Loader2 className="mr-2 animate-spin" />}
      {text || "Complete Stripe onboarding"}
    </Button>
  );
};

