import { EditVentureForm } from "./components/edit-venture-form";
import { FormLayout } from "@/components/layouts/form-layout";

export default async function BusinessVentureEditPage(props: { params: Promise<{ id: string, ventureId: number }> }) {
  const params = await props.params;
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