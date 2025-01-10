import { Card, CardTitle, CardHeader, CardContent } from "@repo/ui/components/card";
import { CreateBusinessForm } from "./components/create-business-form";
import { FormPageLayout } from "@/components/layouts/form-page-layout";

export const dynamic = "force-dynamic";

export default function CreateBusiness() {
  return (
    <FormPageLayout >
      <Card>
        <CardHeader>
          <CardTitle>Create Business</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateBusinessForm className="w-full" />
        </CardContent>
      </Card>
    </FormPageLayout>
  );
}
