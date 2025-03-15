"use client";

import { Button } from "@fundlevel/ui/components/button";
import { createClient } from "@/lib/utils/supabase/client";
import { useRouter } from "next/navigation";
import { env } from "@/env";
import { type ComponentPropsWithoutRef, type ElementType, useState } from "react";
import { redirects } from "@/lib/config/redirects";
import { Loader2 } from "lucide-react";
import { cn } from "@fundlevel/ui/lib/utils";
export type OAuthProvider = "google" | "github";

export interface OAuthButtonProps
  extends ComponentPropsWithoutRef<typeof Button> {
  provider: OAuthProvider;
  icon: ElementType;
  isLoading: string | null;
  handleLogin: (provider: OAuthProvider) => void;
}

export function OAuthButton({
  icon: Icon,
  provider,
  isLoading,
  handleLogin,
  disabled,
  ...props
}: OAuthButtonProps) {
  return (
    <Button
      className="w-full"
      variant="secondary"
      onClick={() => handleLogin(provider)}
      disabled={!!isLoading || disabled}
      {...props}
    >
      {isLoading === provider ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Icon className="w-4 h-4" />
      )}
    </Button>
  );
}

export interface OAuthButtonsProps extends ComponentPropsWithoutRef<"div"> {
  providers: { provider: OAuthProvider; icon: ElementType }[];
  disabled?: boolean;
  redirectTo?: string;
}

export function OAuthButtons({
  providers,
  disabled,
  className,
  redirectTo,
  ...props
}: OAuthButtonsProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (provider: OAuthProvider) => {
    setIsLoading(provider);
    const sb = createClient();

    const { data, error } = await sb.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${env.NEXT_PUBLIC_APP_URL}${redirects.auth.callback(redirectTo)}`,
      },
    });

    if (error) {
      throw error;
    }

    router.push(data.url);
    setIsLoading(null);
  };

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-2 md:gap-4 md:grid-cols-1",
        className,
      )}
      {...props}
    >
      {providers.map(({ provider, icon }) => (
        <OAuthButton
          key={provider}
          provider={provider}
          icon={icon}
          isLoading={isLoading}
          handleLogin={handleLogin}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
