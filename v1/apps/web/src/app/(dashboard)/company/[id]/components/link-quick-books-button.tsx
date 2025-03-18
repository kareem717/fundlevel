"use client";

import { getQuickBooksAuthUrlAction } from "@/actions/company";
import { Button } from "@fundlevel/ui/components/button";
import type { ComponentPropsWithoutRef } from "react";
import { useToast } from "@fundlevel/ui/hooks/use-toast";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@fundlevel/ui/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface LinkQuickBooksButtonProps
  extends ComponentPropsWithoutRef<typeof Button> {
  companyId: number;
}

export function LinkQuickBooksButton({
  className,
  companyId,
  ...props
}: LinkQuickBooksButtonProps) {
  const { toast } = useToast();
  const router = useRouter();

  const { execute, isExecuting } = useAction(getQuickBooksAuthUrlAction, {
    onSuccess: (result) => {
      if (!result?.data?.url) {
        return toast({
          variant: "destructive",
          title: "Uh oh!",
          description: "An error occurred",
        });
      }
      router.push(result.data.url);
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
      onClick={() => execute(companyId)}
      {...props}
    >
      {isExecuting && <Loader2 className="mr-2 animate-spin" />}
      Link QuickBooks
    </Button>
  );
}
