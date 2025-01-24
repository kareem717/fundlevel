"use client";

import { getBusinessStripeAccount, getStripeDashboardUrl } from '@/actions/business';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { FC, ComponentPropsWithoutRef, useState, useEffect } from 'react';
import { useBusiness } from '@/components/providers/business-provider';
import { Button } from '@repo/ui/components/button';
import { Icons } from '@/components/icons';
import { StripeSettingsRedirector } from '../../components/stripe-settings-redirector';
import { Alert, AlertDescription, AlertTitle } from '@repo/ui/components/alert';
import { BusinessStripeAccount } from '@repo/sdk';
import { useToast } from '@repo/ui/hooks/use-toast';

export function StripeDashboardRedirector({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  const router = useRouter();
  const { selectedBusiness } = useBusiness();
  const [stripeAccount, setStripeAccount] = useState<BusinessStripeAccount | null>(null);
  const { toast } = useToast();

  const { execute, hasErrored, isExecuting } = useAction(getStripeDashboardUrl, {
    onSuccess: ({ data }) => {
      if (data?.url) {
        router.push(data.url);
      } else {
        toast({
          title: "Failed to get Stripe account settings link",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Failed to get Stripe account settings link",
        description: "An unknown error occurred",
        variant: "destructive",
      });
    }
  });

  const { execute: getStripeAccount } = useAction(getBusinessStripeAccount, {
    onSuccess: ({ data }) => {
      if (data?.stripeAccount) {
        setStripeAccount(data.stripeAccount);
      } else {
        toast({
          title: "Failed to get Stripe account settings link",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Failed to get Stripe account settings link",
        description: "An unknown error occurred",
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    getStripeAccount(selectedBusiness.id);
  }, [selectedBusiness.id, getStripeAccount]);

  return (
    <div className={className} {...props}>
      {stripeAccount?.stripe_disabled_reason == null ?
        (
          <Button
            onClick={() => execute(selectedBusiness.id)}
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
        ) : (
          <Alert>
            <AlertTitle>Stripe onboarding incomplete</AlertTitle>
            <AlertDescription>
              <StripeSettingsRedirector text="Complete Stripe onboarding" />
            </AlertDescription>
          </Alert>
        )
      }

    </div >
  );
};
