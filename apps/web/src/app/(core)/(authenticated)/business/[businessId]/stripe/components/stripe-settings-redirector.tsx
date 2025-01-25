"use client";

import { getStripeAccountSettingsLink } from '@/actions/business';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { FC, ComponentPropsWithoutRef } from 'react';
import { useToast } from '@repo/ui/hooks/use-toast';
import { useBusiness } from '@/components/providers/business-provider';
import { Button } from '@repo/ui/components/button';
import { Icons } from '@/components/icons';

export interface StripeSettingsRedirectorProps extends ComponentPropsWithoutRef<'button'> {
  text?: string;
}

export const StripeSettingsRedirector: FC<StripeSettingsRedirectorProps> = ({ className, text, ...props }) => {
  const router = useRouter();
  const { selectedBusiness } = useBusiness();
  const { toast } = useToast();
  const { execute, hasErrored, isExecuting } = useAction(getStripeAccountSettingsLink, {
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
  })

  const handleClick = () => {
    execute({
      id: selectedBusiness.id,
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
