import { FormLayout } from "@/components/layouts/form-layout";
import { CreateBusinessForm } from "./components/create-business-form";

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

