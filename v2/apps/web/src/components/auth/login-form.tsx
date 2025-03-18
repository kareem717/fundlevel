"use client";

import { Button } from "@fundlevel/ui/components/button";
import { Input } from "@fundlevel/ui/components/input";
import { type ComponentPropsWithoutRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/utils/supabase/client";
import { redirects } from "@/lib/config/redirects";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@fundlevel/ui/components/form";
import { Loader2 } from "lucide-react";
import { OAuthButtons } from "./oauth-buttons";
import { useRouter } from "next/navigation";
import { useToast } from "@fundlevel/ui/hooks/use-toast";
import { cn } from "@fundlevel/ui/lib/utils";
import { GithubIcon, GoogleIcon } from "../icons";

const formSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      message: "Invalid email address.",
    })
    .email({
      message: "Invalid email address.",
    })
    .min(1, {
      message: "Email is required",
    }),
});

export interface LoginFormProps extends ComponentPropsWithoutRef<"div"> {
  afterOAuthRedirect?: string;
  replacePath?: boolean;
}

export function LoginForm({
  className,
  afterOAuthRedirect,
  replacePath,
  ...props
}: LoginFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const sb = createClient();

    const { error } = await sb.auth.signInWithOtp({
      email: values.email,
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) {
      console.error(error);
      toast({
        title: "Uh oh!",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    } else {
      toast({
        title: "Check your email",
        description: "We've sent you a OTP to login.",
      });

      if (replacePath) {
        router.replace(redirects.auth.otp(values.email));
      } else {
        router.push(redirects.auth.otp(values.email));
      }
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Login
          </Button>
        </form>
      </Form>
      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or continue with
        </span>
      </div>
      <OAuthButtons
        providers={[
          { provider: "google", icon: GoogleIcon },
          { provider: "github", icon: GithubIcon },
        ]}
        disabled={isLoading}
        redirectTo={afterOAuthRedirect}
      />
    </div>
  );
}
