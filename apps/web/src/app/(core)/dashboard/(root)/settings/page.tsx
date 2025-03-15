import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
} from "@fundlevel/ui/components/card";
import { UpdateAccountForm } from "./components/update-account-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@fundlevel/ui/components/accordion";
import { getStripeIdentityAction } from "@/actions/auth";
import { VerifyIdentityModalButton } from "@/components/stripe/verify-identity-modal-button";

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
                <div className="flex flex-col gap-2">
                  {identity ? (
                    <div>
                      <p>Identity: {identity.data?.remote_id}</p>
                      <p>Status: {identity.data?.status}</p>
                    </div>
                  ) : (
                    <VerifyIdentityModalButton />
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
