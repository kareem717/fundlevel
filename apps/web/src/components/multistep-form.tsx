"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  ComponentPropsWithoutRef,
  useState,
} from "react";
import { Form } from "./ui/form";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import Link from "next/link";

export type Step<T extends FieldValues> = {
  content: React.ReactNode;
  fields: Path<T>[];
}

export interface MultiStepFormProps<T extends FieldValues> extends ComponentPropsWithoutRef<"form"> {
  steps: Step<T>[];
  form: UseFormReturn<T>;
  defaultStep?: number;
  handleSubmit: (data: T) => Error | void | Promise<Error | void>;
  successAction: () => void | Promise<void> | string;
  skipSuccessPage?: boolean;
  successButtonText?: string;
  successPageText?: string;
}

export const MultiStepForm = <T extends FieldValues>({
  className,
  steps,
  defaultStep = 0,
  handleSubmit,
  successAction,
  skipSuccessPage = false,
  successButtonText,
  successPageText,
  form: formProps,
  ...props
}: MultiStepFormProps<T> & ComponentPropsWithoutRef<"form">) => {
  const [step, setStep] = useState(defaultStep);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const isLastStep = step >= steps.length - 1
  const hasNext = step < steps.length
  const hasPrevious = step > 0

  const next = async () => {
    if (!hasNext) return;

    console.log("Form values on next 1", formProps.getValues());

    const currentFields = steps[step].fields;
    const isValid = await formProps.trigger(currentFields);

    if (!isValid) return;

    if (isLastStep) {
      setIsSubmitting(true);

      const error = await handleSubmit(formProps.getValues());
      if (!error) {
        setHasSubmitted(true);
      }

      setIsSubmitting(false);
      return;
    }

    if (skipSuccessPage) {
      successAction();
    } else {
      setStep(step + 1);
    }
  };

  const previous = () => {
    if (!hasPrevious) return;

    setStep(step - 1);
  };

  return (
    !hasSubmitted ? (
      <Form {...formProps}>
        <form className={cn("flex flex-col justify-center h-full w-full", className)} {...props}>
          {steps.map((stepItem, index) => (
            <div key={index} className={cn("flex items-center justify-center flex-grow w-full", index !== step && "hidden")}>
              {stepItem.content}
            </div>
          ))}
          <div className="flex flex-col gap-4 [&>*]:w-full mt-auto">
            <Progress value={((step + 1) / steps.length) * 100} />
            <div className="flex justify-between">
              <Button variant="secondary" disabled={!hasPrevious || hasSubmitted} onClick={previous}>Back</Button>
              <Button disabled={!hasNext || isSubmitting || hasSubmitted} onClick={next} type="button">
                {isSubmitting ? <Icons.spinner className="animate-spin size-4" /> : isLastStep ? "Submit" : "Next"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    ) : (
      <div className="flex flex-col gap-4 justify-start items-center">
        <span className="text-2xl font-semibold">{successPageText ?? "Your submission has been received!"}</span>
        {typeof successAction === "function" ? (
          <Button onClick={successAction} variant="secondary">
            {successButtonText ?? "Continue"}
          </Button>
        ) : (
          <Link href={successAction} className={buttonVariants({ variant: "secondary" })}>
            {successButtonText ?? "Continue"}
          </Link>
        )}
      </div>
    )
  );
};
