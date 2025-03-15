"use client";

import { cn } from "@workspace/ui/lib/utils";
import { ComponentPropsWithoutRef, useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createRound } from "@/actions/round";
import { redirects } from "@/lib/config/redirects";
import { useBusiness } from "@/components/providers/business-provider";
import { zCreateRoundParams } from "@workspace/sdk/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { Label } from "@workspace/ui/components/label";
import { formatCurrency } from "@/lib/utils";
import { Separator } from "@workspace/ui/components/separator";
import { LexicalEditor } from "@/components/rich-text/editor";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";

export function CreateRoundForm({
  className,
  ...props
}: ComponentPropsWithoutRef<"form">) {
  const router = useRouter();
  const { selectedBusiness } = useBusiness();
  const [valuation, setValuation] = useState<number>(1000000);
  const [forSale, setForSale] = useState<number>(10);
  const [activeTab, setActiveTab] = useState("description");
  const { toast } = useToast();

  const {
    form,
    action: { isExecuting, executeAsync },
  } = useHookFormAction(createRound, zodResolver(zCreateRoundParams), {
    actionProps: {
      onSuccess: () => {
        form.reset();
        toast({
          title: "Done!",
          description: "Your business has been created.",
        });
        router.push(redirects.app.root);
      },
      onError: ({ error }) => {
        toast({
          title: "Something went wrong",
          description:
            error.serverError?.message || "An unknown error occurred",
          variant: "destructive",
        });
      },
    },
    formProps: {
      defaultValues: {
        round: {
          business_id: selectedBusiness.id,
          description: "",
          price_per_share_usd_cents: 10,
          total_business_shares: 100000,
          total_shares_for_sale: 10000,
        },
        terms: {
          content: "",
        },
      },
    },
  });

  const handleSubmit = async (values: z.infer<typeof zCreateRoundParams>) => {
    await executeAsync({
      ...values,
      round: {
        ...values.round,
        price_per_share_usd_cents: values.round.price_per_share_usd_cents * 100,
      },
    });
  };

  const pricePerShare = form.watch("round.price_per_share_usd_cents");
  const totalShares = form.watch("round.total_business_shares");
  const sharesForSale = form.watch("round.total_shares_for_sale");

  useEffect(() => {
    if (isNaN(pricePerShare) || isNaN(totalShares)) {
      setValuation(0);
    } else {
      setValuation(pricePerShare * totalShares);
    }
  }, [pricePerShare, totalShares]);

  useEffect(() => {
    if (isNaN(sharesForSale) || isNaN(totalShares)) {
      setForSale(0);
    } else {
      setForSale((sharesForSale / totalShares) * 100);
    }
  }, [sharesForSale, totalShares]);

  useEffect(() => {
    const errors = form.formState.errors;
    if (errors.round?.description) {
      setActiveTab("description");
    } else if (errors.terms?.content) {
      setActiveTab("terms");
    }
  }, [form.formState.errors]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn("space-y-8 w-full", className)}
        {...props}
      >
        <FormField
          control={form.control}
          name="round.price_per_share_usd_cents"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price per Share (USD)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.valueAsNumber);
                  }}
                />
              </FormControl>
              <FormDescription>
                What is the price per share in USD?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4">
          <FormField
            control={form.control}
            name="round.total_business_shares"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Business Shares</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step="1"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.valueAsNumber);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  How many shares does the entire company have?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="round.total_shares_for_sale"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Shares for Sale</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    step="1"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.valueAsNumber);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  How many shares are you selling?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4">
          <div className="flex flex-col gap-2">
            <Label>Valuation</Label>
            <p className="mt-2 text-2xl font-bold">
              {formatCurrency(valuation, "USD", "en-US")}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              The valuation of your business is the total value of your
              business.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Label>For Sale</Label>
            <p className="mt-2 text-2xl font-bold">
              {forSale === Number(forSale.toFixed(2))
                ? forSale.toFixed(2)
                : `~ ${forSale.toFixed(2)}`}
              %
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              The rounded percentage of your business that is for sale.
            </p>
          </div>
        </div>
        <Separator />
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          defaultValue="description"
          className="w-full"
        >
          <TabsList className="w-full flex">
            <TabsTrigger value="description" className="flex-1">
              Description
            </TabsTrigger>
            <TabsTrigger value="terms" className="flex-1">
              Terms & Conditions
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description">
            <FormField
              control={form.control}
              name="round.description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <LexicalEditor
                      onChange={(e) => {
                        field.onChange(JSON.stringify(e.toJSON()));
                      }}
                      initialEditorState={field.value}
                      contentClassName="min-h-72"
                    />
                  </FormControl>
                  <FormDescription>Describe this funding round</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          <TabsContent value="terms">
            <FormField
              control={form.control}
              name="terms.content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <LexicalEditor
                      onChange={(e) => {
                        field.onChange(JSON.stringify(e.toJSON()));
                      }}
                      contentClassName="min-h-72"
                      initialEditorState={field.value}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the investor terms and conditions for this funding
                    round
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>
        <Button type="submit" disabled={isExecuting} className="w-full">
          {isExecuting && <Loader2 className="w-4 h-4 animate-spin" />}
          Create Funding Round
        </Button>
      </form>
    </Form>
  );
}
