import { CreateVentureForm } from "./components/create-venture-form";

export default function BusinessVentureCreatePage({ params }: { params: { id: string } }) {
  return (
    <div>
      Create Venture For Business {params.id}
      <div className="max-w-lg mx-auto">
        <CreateVentureForm />
      </div>
    </div>
  );
}
