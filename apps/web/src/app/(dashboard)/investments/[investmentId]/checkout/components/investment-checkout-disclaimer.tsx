"use client"

import { ComponentPropsWithoutRef, FC, useEffect, useState } from "react"
import {
  Card,
} from "@/components/ui/card"
import redirects from "@/lib/config/redirects"
import { env } from "@/env"
import { ScrollArea } from "@/components/ui/scroll-area"
import { faker } from "@faker-js/faker"
import { useInView } from "react-intersection-observer"
import { RoundInvestment } from "@/lib/api"
import { cn } from "@/lib/utils"
import { getInvestmentCheckoutLink } from "@/actions/investments"
import { Icons } from "@/components/ui/icons"
import { useAction } from "next-safe-action/hooks"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export interface InvestmentCheckoutDisclaimerProps extends ComponentPropsWithoutRef<typeof Card> {
  investment: RoundInvestment
}

export const InvestmentCheckoutDisclaimer: FC<InvestmentCheckoutDisclaimerProps> = ({ investment, className, ...props }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0,
  })
  const [disclaimer, setIsDisclaimer] = useState<string>("")

  const router = useRouter();

  const { execute, isExecuting } = useAction(getInvestmentCheckoutLink, {
    onSuccess: ({ data }) => {
      if (data?.url) {
        router.push(data.url);
      }
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  useEffect(() => {
    setIsDisclaimer(faker.lorem.paragraphs(100))
  }, [])

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <div className="h-[40dvh] max-h-[600px] px-8">
        <ScrollArea className="h-full w-full">
          <h1 className="text-xl font-bold w-full text-center">Disclaimer</h1>
          {disclaimer}
          <div ref={ref} />
        </ScrollArea>
      </div>
      <div className="grid gap-1.5 leading-none">
        <Button
          disabled={isExecuting || !inView}
          onClick={() => execute({ investmentId: investment.id, redirectUrl: `${env.NEXT_PUBLIC_APP_URL}${redirects.app.investments.root}` })}
        >
          {isExecuting && <Icons.spinner className="size-4 mr-2 animate-spin" />}
          Checkout
        </Button>
        <p className="text-sm text-muted-foreground">
          By clicking on the button above, you agree to our Terms of Service and Privacy Policy
          and cofirm that you have read and understand the disclaimer above.
        </p>
      </div>
    </div>
  )
}
