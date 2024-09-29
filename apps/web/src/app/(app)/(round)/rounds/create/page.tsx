import { CreateVentureForm } from "@/components/app/ventures/create-venture-form"
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
  title: "Create a venture",
};

export default function CreateVenturePage() {
  return (
    <div className="flex flex-col justify-center w-full h-full p-2 gap-16">
      <div className="flex flex-col items-start w-full">
        <LogoDiv />
      </div>
      <div className="flex flex-col items-center w-full h-full">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Create a venture</CardTitle>
            <CardDescription>Create a new venture to start collecting emails.</CardDescription>
          </CardHeader>
          <CardContent>
            TBI
          </CardContent>
        </Card>
      </div>
    </div>

  )
}