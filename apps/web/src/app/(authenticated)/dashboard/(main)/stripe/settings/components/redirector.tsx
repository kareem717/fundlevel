"use client";

import { getStripeAccountSettingsLink } from '@/actions/busineses';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { FC, ComponentPropsWithoutRef, useEffect } from 'react';
import { toast } from 'sonner';
import { useBusinessContext } from '../../../components/business-context';
import { env } from '@/env';

export interface StripeSettingsRedirectorProps extends ComponentPropsWithoutRef<'div'> { }

export const StripeSettingsRedirector: FC<StripeSettingsRedirectorProps> = ({ className, ...props }) => {
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

  useEffect(() => {
    execute({
      id: currentBusiness.id,
      //TODO: this is just for local testing
      refreshURL: "https://fundlevel.app",
      returnURL: "https://fundlevel.app",
    });
  }, [execute]);

  return (
    <div className={className} {...props}>
      {
        hasErrored ? "Failed to get Stripe account settings link" :
          isExecuting ? "Redirecting..." :
            "You will be redirected to Stripe to complete the onboarding process."
      }
    </div>
  );
};
