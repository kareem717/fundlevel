"use client";

import { createMergeLinkTokenAction } from "@/actions/linked-account";
import { Button } from "@fundlevel/ui/components/button";
import { useMergeLink } from "@mergeapi/react-merge-link";
import { useCallback, useEffect, useState, type ComponentPropsWithoutRef } from "react";
import { useToast } from "@fundlevel/ui/hooks/use-toast";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@fundlevel/ui/lib/utils";
import { Loader2 } from "lucide-react";

interface LinkMergeButtonProps extends ComponentPropsWithoutRef<typeof Button> {
  linkedAccountId: number;
}

export function LinkMergeButton({
  className,
  linkedAccountId,
  ...props
}: LinkMergeButtonProps) {
  const [linkToken, setLinkToken] = useState<string>("");

  const { toast } = useToast();

  const { open, isReady } = useMergeLink({
    linkToken,
    onSuccess: () => { },
  });

  // Use useEffect to call open() after token is set and Link is ready
  useEffect(() => {
    if (linkToken && isReady) {
      open();
    }
  }, [linkToken, isReady, open]);

  const { execute, isExecuting } = useAction(createMergeLinkTokenAction, {
    onSuccess: (result) => {
      if (!result?.data?.linkToken) {
        return toast({
          variant: "destructive",
          title: "Uh oh!",
          description: "An error occurred",
        });
      }
      setLinkToken(result.data.linkToken);
    },
    onError: () => {
      return toast({
        variant: "destructive",
        title: "Uh oh!",
        description: "An error occurred",
      });
    },
  });

  return (
    <Button
      className={cn(className)}
      onClick={() => execute(linkedAccountId)}
      {...props}
    >
      {isExecuting && <Loader2 className="mr-2 animate-spin" />}
      Link Merge
    </Button>
  );
}
