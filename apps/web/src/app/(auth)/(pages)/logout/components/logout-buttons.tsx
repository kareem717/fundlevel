"use client";

import { Button, buttonVariants } from "@repo/ui/components/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/utils/supabase/client";
import {  Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ComponentPropsWithoutRef, useState } from "react";
import { redirects } from "@/lib/config/redirects";
import { useToast } from "@repo/ui/hooks/use-toast";
import Link from "next/link";

export function LogoutButtons({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();

  async function handleLogout() {

    setIsLoading(true);

    const sb = createClient();
    const { error } = await sb.auth.signOut();

    if (error) {
      toast({
        title: "Uh oh!",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return setIsLoading(false);
    } else {
      router.push(redirects.auth.login);
    }
  };

  return (
    <div className={cn("grid grid-cols-2 gap-4 md:grid-cols-1", className)} {...props}>
      <Button className="w-full" variant="secondary" onClick={handleLogout} disabled={isLoading}>
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        Logout
      </Button>
      <Link className={cn(buttonVariants(), "w-full")} href={redirects.app.root}>
        Dashboard
      </Link>
    </div>
  );
};
