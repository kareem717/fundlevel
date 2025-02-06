import { getBusinessCreateRoundrequirements } from "@/actions/business";
import { CreateRoundForm } from "./components/create-round-form";
import { Card, CardContent, CardTitle, CardHeader } from "@repo/ui/components/card";
import { notFound } from "next/navigation";

export default async function CreateRoundPage({ params }: { params: { businessId: string } }) {
  const { businessId } = await params;
  const parsedBusinessId = parseInt(businessId);

  // Tbh this is not needed, but just in case
  if (isNaN(parsedBusinessId)) {
    return notFound()
  }

  const reqs = await getBusinessCreateRoundrequirements(parsedBusinessId)
  const reqsData = reqs?.data?.requirements || {}

  const isReady = Object.values(reqsData).every(req => req === true)

  if (!isReady) {
    return (
      <div className="flex flex-col gap-4 h-full justify-center items-center">
        <p>You need to complete the following requirements before you can create a funding round:</p>
        <ul>
          {Object.entries(reqsData).map(([key, value]) => (
            <li key={key}>{key}: {value ? "True" : "False"}</li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 h-full justify-center items-center">
      <Card className="self-center">
        <CardHeader>
          <CardTitle>Create Funding Round</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateRoundForm className="max-w-screen-md" />
        </CardContent>
      </Card>
    </div>
  )
}
