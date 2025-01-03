import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { UpdateLegalSectionForm } from "./components/update-legal-section-form";
export default function ProfileSettingsPage() {
  return (
    <div>
      <Accordion type="single" collapsible className="w-[400px]">
        <AccordionItem value="basic">
          <AccordionTrigger>Account</AccordionTrigger>
          <AccordionContent>
            Make changes to your account here.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="legal">
          <AccordionTrigger>Legal</AccordionTrigger>
          <AccordionContent>
            <UpdateLegalSectionForm />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
