import { Card, CardTitle, CardHeader, CardContent } from "@repo/ui/components/card";
import { CreateBusinessForm } from "./components/create-business-form";

export default function CreateBusiness() {
  return (
    <div className="flex flex-col gap-4 h-full justify-center items-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Business</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateBusinessForm className="w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
