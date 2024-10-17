import { EditVentureForm } from "./components/edit-venture-form";
import { FormLayout } from "@/components/layouts/form-layout";

export default function BusinessVentureEditPage({ params }: { params: { id: string, ventureId: number } }) {
  // the layout already verified the ventureId for us 

  return (
    <FormLayout
      title="Edit Venture"
      description="Edit the venture"
    >
      <EditVentureForm ventureId={params.ventureId} />
    </FormLayout>
  );
}