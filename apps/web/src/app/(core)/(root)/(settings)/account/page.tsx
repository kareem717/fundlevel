import { Card, CardContent, CardTitle, CardHeader } from "@repo/ui/components/card";
import { UpdateAccountForm } from "./components/update-account-form";
import { IdentityCard } from "./components/identity-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/accordion"
import { getStripeIdentityAction } from "@/actions/auth";

export default async function AccountSettingsPage() {
  //TODO: consider moving to client
  const identity = await getStripeIdentityAction();

  return (
    <div className="h-full flex justify-center items-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="details">
              <AccordionTrigger>Details</AccordionTrigger>
              <AccordionContent>
                <UpdateAccountForm />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="identity">
              <AccordionTrigger>Identity</AccordionTrigger>
              <AccordionContent>
                <IdentityCard identity={identity?.data || null} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
