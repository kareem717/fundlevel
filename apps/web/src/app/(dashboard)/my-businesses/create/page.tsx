import { FormLayout } from "@/components/layouts/form-layout";
import { CreateBusinessForm } from "./components/create-business-form";

export const dynamic = 'force-dynamic'

export default function CreateBusinessPage() {
  return (
    <FormLayout
      title="Create Business"
      description="Create a new business"
    >
      <CreateBusinessForm />
    </FormLayout>
  );
}

