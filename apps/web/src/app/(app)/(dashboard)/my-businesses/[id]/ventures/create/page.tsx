import { FormLayout } from "@/components/layouts/form-layout";
import { CreateVentureForm } from "./components/create-venture-form";

export default function BusinessVentureCreatePage({ params }: { params: { id: string } }) {
  const businessId = parseInt(params.id)
  if (isNaN(businessId)) {
    throw new Error("Invalid business ID")
  }

  return (
    <FormLayout
      title="Create Venture For Business"
      description="Create a new venture for the business"
    >
      <CreateVentureForm businessId={businessId} />
    </FormLayout>
  );
}
