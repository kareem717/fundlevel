import { CreateRoundForm } from "@/components/app/rounds/forms/create";
import { LogoDiv } from "@/components/logo-div"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Metadata } from "next";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Icons } from "@/components/icons";

export const metadata: Metadata = {
  title: "Create a round",
};

export default async function CreateRoundPage() {
  return (
    <div className="flex flex-col justify-center w-full h-full p-2 gap-8">
      <Alert className="w-full max-w-2xl mx-auto">
        <Icons.warning className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can not edit a round after creating it.
        </AlertDescription>
      </Alert>
      <div className="flex flex-col items-center w-full h-full">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Create a round</CardTitle>
            <CardDescription>Create a new round to start collecting emails.</CardDescription>
          </CardHeader>
          <CardContent>
            <CreateRoundForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}