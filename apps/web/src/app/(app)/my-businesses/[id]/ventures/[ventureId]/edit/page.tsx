import { EditVentureForm } from "./components/edit-venture-form";
import { notFound } from "next/navigation";

export default function BusinessVentureEditPage({ params }: { params: { id: string, ventureId: number } }) {
  // the layout already verified the ventureId for us 

  return (
    <div>
      Edit Venture {params.ventureId} For Business {params.id}
      <div className="max-w-lg mx-auto">
        <EditVentureForm ventureId={params.ventureId} />
      </div>
    </div>
  );
}