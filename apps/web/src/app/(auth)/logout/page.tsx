import { LogoutForm } from "@/app/(auth)/components/logout-form";
import redirects from "@/lib/config/redirects";
import createClient from "@/lib/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function LogoutPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect(redirects.auth.login);
  }

  return (
    <div className="mx-auto w-full max-w-[350px]">
      <LogoutForm />
    </div>
  );
}
