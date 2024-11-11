import { VentureViewActions } from "./components/venture-actions.tsx";
import { getVentureById } from "@/actions/ventures";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Star } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import BackButton from "./components/back-button";
import { VentureTabs } from "./components/tabs";
import redirects from "@/lib/config/redirects";
import { InvestmentDialog } from "./components/investment-dialog";
import { env } from "@/env";

export default async function VentureViewPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const parsedId = parseInt((params.id as string) || ""); // Parse the id

  if (isNaN(parsedId)) {
    notFound();
  }

  const ventureResp = await getVentureById(parsedId);

  if (!ventureResp?.data || ventureResp?.serverError) {
    console.error(ventureResp);
    throw new Error("Something went wrong");
  }

  const { business, ...venture } = ventureResp.data.venture;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="relative h-[40vh] py-4 bg-gradient-to-r from-purple-600 to-blue-600">
        <Image
          src="/filler.jpeg"
          alt="Bilal Burgers Banner"
          className="h-full w-full object-cover opacity-50 absolute inset-0 -z-10"
          width={1200}
          height={320}
        />

        <div className="container flex flex-col h-full justify-between">
          <BackButton />
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg" alt="Bilal Burgers Logo" />
              <AvatarFallback>BB</AvatarFallback>
            </Avatar>
            <div className="text-white">
              <h1 className="text-2xl font-bold">{venture.name}</h1>
              <p className="text-sm">Toronto, Canada</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions  */}
      <nav className="border-b bg-background">
        <div className="container flex items-center justify-between p-4">
          <div className="flex items-center flex-wrap justify-between gap-6 w-full">
            <VentureTabs />
            <VentureViewActions ventureId={venture.id} />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-8 px-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-lg border p-4">
              <h2 className="font-semibold">Please note:</h2>
              <p className="text-sm text-muted-foreground">
                Investing in early stage businesses involves risks, including
                illiquidity, lack of dividends, loss of investment and dilution,
                and it should be done only as part of a diversified portfolio.
              </p>
            </div>

            <section>
              <h2 className="text-xl font-bold">Summary</h2>
              <p className="mt-2 text-muted-foreground">
                A family-friendly burger restaurant that combines delicious,
                high-quality ingredients with a welcoming atmosphere. Known for
                its mouth-watering burgers topped with fresh, flavorful
                ingredients, Bilal Burgers creates an unforgettable dining
                experience with options for all tastes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold">The Business</h2>
              <p className="mt-2 text-muted-foreground">
                The menu offers classic beef burgers, chicken sandwiches, and
                vegetarian options, all made to order. With a nod to cultural
                heritage through thoughtful decor and a unique blend of spices,
                Bilal Burgers has become a favorite spot for locals and
                newcomers alike.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold">The Market</h2>
              <p className="mt-2 text-muted-foreground">
                The restaurant&apos;s focus on quality, flavor, and community makes
                it a standout choice for anyone craving a hearty, satisfying
                meal. Our unique positioning in the market combines traditional
                flavors with modern dining expectations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold">The Team</h2>
              <div className="mt-4 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>ST</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">Team Member</div>
                      <div className="text-sm text-muted-foreground">CEO</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold">FAQ</h2>
              <Accordion type="single" collapsible className="mt-4">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do we make money?</AccordionTrigger>
                  <AccordionContent>
                    Through food sales and catering services.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Why should you invest?</AccordionTrigger>
                  <AccordionContent>
                    Strong growth potential and proven business model.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    Our vision for the company?
                  </AccordionTrigger>
                  <AccordionContent>
                    To become the leading halal burger chain in North America.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium">Target</div>
                    <div className="text-2xl font-bold">CA $1,000,000</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Minimum</div>
                    <div className="text-2xl font-bold">CA $5,000</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Investment Raised</div>
                    <div className="text-2xl font-bold">CA $0</div>
                  </div>
                </div>
              </CardContent>
              {venture.activeRound && (
                <CardFooter>
                  <InvestmentDialog
                    round={venture.activeRound}
                    redirectUrl={env.NEXT_PUBLIC_APP_URL + redirects.app.portfolio.investments.history}
                    triggerProps={{
                      className: "w-full",
                    }}
                  />
                </CardFooter>
              )}
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold">Highlights</h3>
                <ul className="mt-4 space-y-4">
                  <li className="flex gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    <div className="text-sm">
                      Customer Retention Rate: 85% – High repeat customer rate
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    <div className="text-sm">
                      Order Fulfillment Time: 15 minutes on average
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    <div className="text-sm">
                      Revenue Growth: 20% year-over-year
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}