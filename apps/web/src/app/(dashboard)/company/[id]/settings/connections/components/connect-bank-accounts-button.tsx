"use client";

import { Button } from "@fundlevel/ui/components/button";
import { usePlaidLink } from "react-plaid-link";
import { useState, useEffect, type ComponentPropsWithoutRef } from "react";
import { toast } from "@fundlevel/ui/components/sonner";
import { cn } from "@fundlevel/ui/lib/utils";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { client } from "@fundlevel/sdk";
import { useAuth } from "@fundlevel/web/components/providers/auth-provider";
import { env } from "@fundlevel/web/env";

interface ConnectBankAccountButtonProps
  extends ComponentPropsWithoutRef<typeof Button> {
  companyId: number;
}

export function ConnectBankAccountButton({
  className,
  companyId,
  ...props
}: ConnectBankAccountButtonProps) {
  const [token, setToken] = useState<string>("");
  const [publicToken, setPublicToken] = useState<string>("");
  const { authToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  if (!authToken) {
    throw new Error("ConnectBankAccountButton: No bearer token found");
  }

  const { mutate: createPlaidLinkToken } = useMutation({
    mutationFn: async () => {
      const resp = await client(env.NEXT_PUBLIC_BACKEND_URL, authToken).company[
        ":companyId"
      ].plaid["link-token"].$post({
        param: {
          companyId,
        },
      });

      if (!resp.ok) {
        throw new Error("Failed to create Plaid link token");
      }

      return await resp.json();
    },
    onMutate: () => setIsLoading(true),
    onSuccess: (result) => {
      setToken(result.linkToken);
    },
    onError: () => {
      setIsLoading(false);
      toast.error("Uh oh!", {
        description: "An error occurred, please try again.",
        action: {
          label: "Try again",
          onClick: () => {
            createPlaidLinkToken();
          },
        },
      });
    },
  });

  const { mutate: swap } = useMutation({
    mutationFn: async (publicToken: string) => {
      const resp = await client(env.NEXT_PUBLIC_BACKEND_URL, authToken).company[
        ":companyId"
      ].plaid["public-token"].$post({
        param: {
          companyId,
        },
        json: {
          publicToken,
        },
      });

      if (!resp.ok) {
        throw new Error("Failed to swap Plaid public token");
      }

      return await resp.json();
    },
    onSuccess: () => {
      toast.success("Done!", {
        description: "Your financial accounts were linked successfully.",
      });
    },
    onError: () => {
      toast.error("Uh oh!", {
        description: "An error occurred, please try again.",
        action: {
          label: "Try again",
          onClick: () => {
            swap(publicToken);
          },
        },
      });
    },
    onSettled: () => setIsLoading(false),
  });

  const { open, ready } = usePlaidLink({
    token,
    onSuccess: (publicToken) => {
      setPublicToken(publicToken);
      swap(publicToken);
    },
    onExit: () => {
      setIsLoading(false);
    },
  });

  // Use useEffect to call open() after token is set and Link is ready
  useEffect(() => {
    if (token && ready) {
      open();
    }
  }, [token, ready, open]);

  return (
    <Button
      className={cn(className)}
      onClick={() => createPlaidLinkToken()}
      disabled={isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 animate-spin" />}
      Link Plaid
    </Button>
  );
}
