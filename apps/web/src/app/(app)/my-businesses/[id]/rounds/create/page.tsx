import { CreateRoundForm } from "./components/create-round-form";

export default function BusinessRoundCreatePage({ params, searchParams }: { params: { id: string }, searchParams: { ventureId?: string } }) {

  // TODO: get account ventures and pass to form, if none - display that you need to create a venture first
  return (
    <div>
      Create Round For Business {params.id}
      <div className="max-w-lg mx-auto">
        <CreateRoundForm businessId={parseInt(params.id)} ventureId={searchParams.ventureId ? parseInt(searchParams.ventureId) : undefined} />
      </div>
    </div>
  );
}
