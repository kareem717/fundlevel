import { FormPageLayout } from "@/components/layouts/form-page-layout";
import { LogoDiv } from "@/components/logo-div";
import { Skeleton } from "@workspace/ui/components/skeleton";

export default function LoadingRound() {
  return (
    <FormPageLayout>
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <LogoDiv className="self-center w-40" />
        <Skeleton className="h-96 w-full max-w-2xl" />
      </div>
    </FormPageLayout>
  );
}
