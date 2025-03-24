import { buttonVariants } from "@fundlevel/ui/components/button";
import { Button } from "@fundlevel/ui/components/button";
import { SignOutButton } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@fundlevel/ui/components/card";
import { cn } from "@fundlevel/ui/lib/utils";
import { redirects } from "@fundlevel/web/lib/config/redirects";
import Link from "next/link";

export default async function LogoutPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Are you sure?</CardTitle>
        <CardDescription>Logout from your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="grid grid-cols-2 gap-4 md:grid-cols-1"
        >
          <SignOutButton>
            <Button
              className="w-full"
              variant="secondary"
            >
              Logout
            </Button>
          </SignOutButton>
          <Link
            className={cn(buttonVariants(), "w-full")}
            href={redirects.app.root}
          >
            Dashboard
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
