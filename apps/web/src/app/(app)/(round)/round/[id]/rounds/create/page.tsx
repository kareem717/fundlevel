import { CreateRoundForm } from "@/components/app/rounds/create-round-form";
import { LogoDiv } from "@/components/logo-div"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create a round",
};

export default function CreateVenturePage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col justify-center w-full h-full p-2 gap-16">
      <div className="flex flex-col items-start w-full">
        <LogoDiv />
      </div>
      <div className="flex flex-col items-center w-full h-full">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Create a round</CardTitle>
            <CardDescription>Create a new round for your venture.</CardDescription>
          </CardHeader>
          <CardContent>
            <CreateRoundForm ventureId={parseInt(params.id)} />
          </CardContent>
        </Card>
      </div>
    </div>

  )
}