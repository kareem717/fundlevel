import { CreateRoundForm } from "./components/create-round-form";
import { FormLayout } from "@/components/layouts/form-layout";
export default async function BusinessRoundCreatePage(
  props: { params: Promise<{ id: string }>, searchParams: Promise<{ ventureId?: string }> }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  // TODO: get account ventures and pass to form, if none - display that you need to create a venture first
  return (
    <FormLayout
      title="Create Round For Business"
      description="Create a new round for the business"
    >
      <CreateRoundForm businessId={parseInt(params.id)} ventureId={searchParams.ventureId ? parseInt(searchParams.ventureId) : undefined} />
    </FormLayout>
  );
}
