import { CreateRoundForm } from "./components/create-round-form";

export default function BusinessRoundCreatePage({ params }: { params: { id: string } }) {

  // TODO: get account ventures and pass to form, if none - display that you need to create a venture first
  return (
    <div>
      Create Round For Business {params.id}
      <div className="max-w-lg mx-auto">
        <CreateRoundForm businessId={parseInt(params.id)} />
      </div>
    </div>
  );
}
