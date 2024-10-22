import { BusinessInvestmentsTable } from "./components/business-investments-table";
import { columns } from "./components/business-investments-table/columns";

export default async function BusinessInvestmentsPage(
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const businessId = parseInt(params.id)
  if (isNaN(businessId)) {
    throw new Error("Invalid business id")
  }

  return (
    <div>
      <div className="flex justify-between items-center max-w-screen-lg mx-auto">
        <h1>My Recieved Investments</h1>
      </div>
      <div className="max-w-screen-lg mx-auto">
        <BusinessInvestmentsTable columns={columns} data={[]} id={businessId} />
      </div>
    </div>
  );
}
