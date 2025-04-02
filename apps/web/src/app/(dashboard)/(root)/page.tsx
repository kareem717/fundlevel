import { CreateCompanyDialog } from "./components/create-company-dialog";
import { CompanyGrid } from "./components/company-grid";
import { Plus } from "lucide-react";
export default async function DashboardPage() {
  return (
    <div className="py-8 mx-auto w-full">
      <div className="mb-6 flex justify-end">
        {/* <SearchCommand /> */}
        <CreateCompanyDialog
          triggerProps={{
            children: (
              <>
                <Plus />
                Add Company
              </>
            ),
          }}
        />
      </div>
      <CompanyGrid />
    </div>
  );
}
