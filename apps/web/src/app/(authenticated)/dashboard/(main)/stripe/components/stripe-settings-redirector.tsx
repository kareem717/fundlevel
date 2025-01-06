"use client";

import { getStripeAccountSettingsLink } from '@/actions/busineses';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { FC, ComponentPropsWithoutRef } from 'react';
import { toast } from 'sonner';
import { useBusinessContext } from '../../components/business-context';
import { Button } from '@repo/ui/components/button';
import { Icons } from '@/components/icons';

export interface StripeSettingsRedirectorProps extends ComponentPropsWithoutRef<'button'> {
  text?: string;
}

export const StripeSettingsRedirector: FC<StripeSettingsRedirectorProps> = ({ className, text, ...props }) => {
  const router = useRouter();
  const { currentBusiness } = useBusinessContext();

  const { execute, hasErrored, isExecuting } = useAction(getStripeAccountSettingsLink, {
    onSuccess: ({ data }) => {
      if (data?.url) {
        router.push(data.url);
      } else {
        toast.error("Failed to get Stripe account settings link");
      }
    },
    onError: () => {
      toast.error("Failed to get Stripe account settings link");
    }
  })

  const handleClick = () => {
    execute({
      id: currentBusiness.id,
      //TODO: this is just for local testing
      refreshURL: "https://fundlevel.app",
      returnURL: "https://fundlevel.app",
    });
  }

  return (
    <Button disabled={isExecuting} onClick={handleClick} className={className} {...props}>
      {isExecuting ? (
        <>
          <Icons.spinner className="mr-2 animate-spin" />
          Redirecting...
        </>
      ) : hasErrored ? (
        "Failed to get link. Please try again."
      ) : (
        text || "Complete Stripe onboarding"
      )}
    </Button>
  );
};
