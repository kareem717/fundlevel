"use client";

import { createPlaidLinkTokenAction, swapPlaidPublicTokenAction } from "@/actions/linked-account";
import { Button } from "@fundlevel/ui/components/button";
import { usePlaidLink } from "react-plaid-link";
import { useCallback, useState, useEffect, type ComponentPropsWithoutRef } from "react";
import { useToast } from "@fundlevel/ui/hooks/use-toast";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@fundlevel/ui/lib/utils";
import { Loader2 } from "lucide-react";

interface LinkPlaidButtonProps extends ComponentPropsWithoutRef<typeof Button> {
  linkedAccountId: number;
}

export function LinkPlaidButton({
  className,
  linkedAccountId,
  ...props
}: LinkPlaidButtonProps) {
  const [token, setToken] = useState<string>("");

  const { toast } = useToast();


  const { execute: swap, isExecuting: isSwapping } = useAction(swapPlaidPublicTokenAction, {
    onSuccess: (result) => {
      return toast({
        title: "Done!",
        description: "Your financial accounts were linked successfully.",
      });
    },
    onError: () => {
      return toast({
        variant: "destructive",
        title: "Uh oh!",
        description: "An error occurred, please try again.",
      });
    },
  });

  const { open, ready } = usePlaidLink({
    token,
    onSuccess: (publicToken) => { swap({ linkedAccountId, publicToken, }); },
  });

  // Use useEffect to call open() after token is set and Link is ready
  useEffect(() => {
    if (token && ready) {
      open();
    }
  }, [token, ready, open]);

  const { execute, isExecuting } = useAction(createPlaidLinkTokenAction, {
    onSuccess: (result) => {
      if (!result?.data?.linkToken) {
        return toast({
          variant: "destructive",
          title: "Uh oh!",
          description: "An error occurred",
        });
      }

      console.log("result", result);
      setToken(result.data.linkToken);
      // Remove the immediate open() call - it will be handled by useEffect
    },
    onError: () => {
      return toast({
        variant: "destructive",
        title: "Uh oh!",
        description: "An error occurred",
      });
    },
  });

  const isLoading = isExecuting || isSwapping;

  return (
    <Button
      className={cn(className)}
      onClick={() => execute(linkedAccountId)}
      disabled={isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 animate-spin" />}
      Link Plaid
    </Button>
  );
}
