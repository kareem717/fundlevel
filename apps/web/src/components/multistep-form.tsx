"use client";

import { Button } from "@fundlevel/ui/components/button";
import { Icons } from "@/components/icons";
import { Progress } from "@fundlevel/ui/components/progress";
import { cn } from "@fundlevel/ui/lib/utils";
import { ComponentPropsWithoutRef, useState } from "react";
import { Form } from "@fundlevel/ui/components/form";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export type Step<T extends FieldValues> = {
  content: React.ReactNode;
  fields: Path<T>[];
  onNext?: () => void | boolean | Promise<void | boolean>;
  onBack?: () => void | boolean | Promise<void | boolean>;
  nextButtonText?: string;
};

export interface MultiStepFormProps<T extends FieldValues>
  extends ComponentPropsWithoutRef<"form"> {
  steps: Step<T>[];
  form: UseFormReturn<T>;
  defaultStep?: number;
  handleSubmit: (data: T) => boolean | void | Promise<boolean | void>;
}

export function MultiStepForm<T extends FieldValues>({
  className,
  steps,
  defaultStep = 0,
  handleSubmit,
  form: formProps,
  ...props
}: MultiStepFormProps<T> & ComponentPropsWithoutRef<"form">) {
  const [step, setStep] = useState(defaultStep);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  const isLastStep = step >= steps.length - 1;
  const hasNext = step < steps.length;
  const hasPrevious = step > 0;

  const next = async () => {
    if (!hasNext) return;

    const currentFields = steps[step]?.fields;
    const isValid = await formProps.trigger(currentFields);

    if (!isValid) return;

    if (steps[step]?.onNext) {
      setIsExecuting(true);
      const canContinue = await steps[step].onNext();
      setIsExecuting(false);

      if (canContinue === false) {
        return;
      }
    }

    if (isLastStep) {
      setIsSubmitting(true);

      const hasErrored = await handleSubmit(formProps.getValues());
      if (!hasErrored) {
        setHasSubmitted(true);
      }

      setIsSubmitting(false);
      return;
    }

    setStep(step + 1);
  };

  const previous = async () => {
    if (!hasPrevious) return;

    if (steps[step]?.onBack) {
      setIsExecuting(true);
      const canContinue = await steps[step].onBack();
      setIsExecuting(false);

      if (canContinue === false) {
        return;
      }
    }

    setStep(step - 1);
  };

  return (
    <Form {...formProps}>
      <form
        className={cn("flex flex-col justify-center h-full w-full", className)}
        {...props}
      >
        {steps.map((stepItem, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center justify-center flex-grow w-full",
              index !== step && "hidden",
            )}
          >
            {stepItem.content}
          </div>
        ))}
        <div className="flex flex-col gap-4 [&>*]:w-full mt-auto">
          <Progress value={((step + 1) / steps.length) * 100} />
          <div className="flex justify-between">
            <Button
              variant="secondary"
              disabled={!hasPrevious || hasSubmitted}
              onClick={previous}
              type="button"
            >
              Back
            </Button>
            <Button
              disabled={!hasNext || isSubmitting || hasSubmitted || isExecuting}
              onClick={next}
              type="button"
            >
              {(isExecuting || isSubmitting) && (
                <Icons.spinner className="animate-spin size-4" />
              )}
              {steps[step]?.nextButtonText
                ? steps[step].nextButtonText
                : isLastStep
                  ? "Submit"
                  : "Next"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
