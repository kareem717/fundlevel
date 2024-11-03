import { LogoDiv } from "@/components/ui/logo-div";
import { CreateBusinessForm } from "./components/create-business-form";

export const dynamic = "force-dynamic";

export default function CreateBusiness() {
  return (
    <div className="flex flex-col h-screen w-full p-4">
      <LogoDiv />
      <div className="flex justify-center items-center h-full w-full ">
        <CreateBusinessForm className="w-full" />
      </div>
    </div>
  );
}
