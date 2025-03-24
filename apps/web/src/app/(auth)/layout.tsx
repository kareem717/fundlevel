import { ReactNode } from "react";
import { FormPageLayout } from "@fundlevel/web/components/layouts/form-page-layout";
import { LogoDiv } from "@fundlevel/web/components/logo-div";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <FormPageLayout>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <LogoDiv className="self-center w-40" />
        {children}
      </div>
    </FormPageLayout>
  );
}
