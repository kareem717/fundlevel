import { Button } from "@fundlevel/ui/components/button";
import { Card, CardContent } from "@fundlevel/ui/components/card";
import { GithubIcon, GoogleIcon } from "@fundlevel/ui/components/custom/icons";
import { Input } from "@fundlevel/ui/components/input";
import { Label } from "@fundlevel/ui/components/label";
import { cn } from "@fundlevel/ui/lib/utils";
import { ArrowRight } from "lucide-react";
import { SignInButton } from "./sign-in-button";

interface SignInFormProps extends React.ComponentPropsWithoutRef<"div"> {
	callbackURL?: string;
}

export function SignInForm({
	className,
	callbackURL,
	...props
}: SignInFormProps) {
	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card className="overflow-hidden p-0">
				<CardContent className="grid p-0 md:grid-cols-2">
					<form className="p-6 md:p-8">
						<div className="flex flex-col gap-6">
							<div className="flex flex-col items-center text-center">
								<h1 className="font-bold text-2xl">Welcome back</h1>
								<p className="text-balance text-muted-foreground">
									Sign in to your account
								</p>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<SignInButton
									provider="google"
									variant="outline"
									type="button"
									className="w-full"
									callbackURL={callbackURL}
								>
									<GoogleIcon className="size-4" />
									<span className="sr-only">Login with Google</span>
								</SignInButton>
								<Button
									variant="outline"
									type="button"
									className="w-full"
									disabled
								>
									<GithubIcon className="size-4" />
									<span className="sr-only">Login with Meta</span>
								</Button>
							</div>
							<div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
								<span className="relative z-10 bg-card px-2 text-muted-foreground">
									Or continue with
								</span>
							</div>
							<div className="grid gap-3">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="m@example.com"
									required
									disabled
								/>
							</div>
							<Button type="submit" className="w-full" disabled>
								Continue with email <ArrowRight className="size-4" />
							</Button>
						</div>
					</form>
					<div className="relative hidden bg-muted md:block">
						<img
							src="/placeholder.png"
							alt="Placeholder PNG"
							className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
						/>
					</div>
				</CardContent>
			</Card>
			<div className="text-balance text-center text-muted-foreground text-xs *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-primary">
				By clicking continue, you agree to our{" "}
				{/* <Link to="" className="underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link to="/privacy" className="underline">
          Privacy Policy
        </Link> */}
				.
			</div>
		</div>
	);
}
