import { CreateVentureForm } from "./components/create-venture-form";

export default function BusinessVentureCreatePage({ params }: { params: { id: string } }) {
  const businessId = parseInt(params.id)
  if (isNaN(businessId)) {
    throw new Error("Invalid business ID")
  }

  return (
    <div>
      Create Venture For Business {params.id}
      <div className="max-w-lg mx-auto">
        <CreateVentureForm businessId={businessId} />
      </div>
    </div>
  );
}
