"use client";

import { getStripeDashboardUrl } from '@/actions/busineses';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { FC, ComponentPropsWithoutRef } from 'react';
import { toast } from 'sonner';
import { useBusinessContext } from '../../../components/business-context';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

export interface StripeDashboardRedirectorProps extends ComponentPropsWithoutRef<'div'> { }

export const StripeDashboardRedirector: FC<StripeDashboardRedirectorProps> = ({ className, ...props }) => {
  const router = useRouter();
  const { currentBusiness } = useBusinessContext();

  const { execute, hasErrored, isExecuting } = useAction(getStripeDashboardUrl, {
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
  });

  return (
    <div className={className} {...props}>
      <Button
        onClick={() => execute(currentBusiness.id)}
        disabled={isExecuting}
      >
        {isExecuting ? (
          <>
            <Icons.spinner className="animate-spin" />
            Redirecting to Stripe...
          </>
        ) : hasErrored ? (
          "Failed to load Stripe dashboard"
        ) : (
          "Go to Dashboard"
        )}
      </Button>
    </div>
  );
};
