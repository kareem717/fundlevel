"use client";

import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import redirects from "@/lib/config/redirects";
import {
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { isVentureLiked, likeVenture, unlikeVenture } from "@/actions/ventures";
import { useRouter } from "next/navigation";
import { Account } from "@/lib/api";
import { getAccount } from "@/actions/auth";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

export interface VentureViewActionsProps
  extends ComponentPropsWithoutRef<typeof DropdownMenu> {
  ventureId: number;
}

export const VentureViewActions: FC<VentureViewActionsProps> = ({
  ventureId,
}) => {
  const [liked, setLiked] = useState<boolean | undefined>(false);
  const [account, setAccount] = useState<Account | undefined>(undefined);

  const router = useRouter();

  const { execute: isLikedExecute, isExecuting: isLikedExecuting } = useAction(
    isVentureLiked,
    {
      onSuccess: ({ data }) => {
        setLiked(data?.favourited ?? false);
      },
      onError: () => {
        toast.error("Failed to check if round is liked");
      },
    }
  );

  const { execute: likeExecute, isExecuting: isLikeExecuting } = useAction(
    likeVenture,
    {
      onSuccess: () => {
        setLiked(true);
        toast.success("Round liked");
      },
      onError: () => {
        toast.error("Failed to like round");
      },
    }
  );

  const { execute: unlikeExecute, isExecuting: isUnlikeExecuting } = useAction(
    unlikeVenture,
    {
      onSuccess: () => {
        setLiked(false);
        toast.success("Round unliked");
      },
      onError: () => {
        toast.error("Failed to unlike round");
      },
    }
  );

  const { execute: getAccountExecute, isExecuting: isGetAccountExecuting } =
    useAction(getAccount, {
      onSuccess: ({ data }) => {
        setAccount(data);
      },
      onError: () => {
        toast.error("Failed to get account");
      },
    });

  useEffect(() => {
    getAccountExecute();
    isLikedExecute(ventureId);
  }, [getAccountExecute, isLikedExecute, ventureId]);

  //TODO: add better loading state
  const isLoading =
    isLikedExecuting ||
    isLikeExecuting ||
    isUnlikeExecuting ||
    isGetAccountExecuting;

  const handleLike = () => {
    if (!isGetAccountExecuting && !account) {
      router.push(redirects.auth.login);
      return;
    }

    if (isLoading) {
      return;
    }

    if (liked) {
      unlikeExecute(ventureId);
    } else {
      likeExecute(ventureId);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          toast.info("Not yet implemented");
        }}
      >
        <MessageSquare className="h-5 w-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="text-red-500 hover:text-red-500/80"
        disabled={isLoading}
        onClick={() => handleLike()}
      >
        {isLoading ? (
          <Icons.loader className="h-4 w-4 animate-spin" />
        ) : (
          <Icons.heart
            className={cn(
              "h-4 w-4 text-muted-foreground",
              liked && "text-red-500 fill-current"
            )}
          />
        )}
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          toast.info("Not yet implemented");
        }}
      >
        <Icons.upload className="h-4 w-4 text-muted-foreground" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          toast.info("Not yet implemented");
        }}
      >
        <Icons.flag className="h-4 w-4 text-muted-foreground" />
      </Button>
    </div>
  );
};
