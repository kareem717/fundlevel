"use client";

import { Button, buttonVariants } from "@fundlevel/ui/components/button";
import { createClient } from "@/lib/utils/supabase/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ComponentPropsWithoutRef, useState } from "react";
import { redirects } from "@/lib/config/redirects";
import { useToast } from "@fundlevel/ui/hooks/use-toast";
import Link from "next/link";
import { cn } from "@fundlevel/ui/lib/utils";

export function LogoutButtons({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
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
    }

    router.push(redirects.auth.login);
  }

  return (
    <div
      className={cn("grid grid-cols-2 gap-4 md:grid-cols-1", className)}
      {...props}
    >
      <Button
        className="w-full"
        variant="secondary"
        onClick={handleLogout}
        disabled={isLoading}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        Logout
      </Button>
      <Link
        className={cn(buttonVariants(), "w-full")}
        href={redirects.app.root}
      >
        Dashboard
      </Link>
    </div>
  );
}
