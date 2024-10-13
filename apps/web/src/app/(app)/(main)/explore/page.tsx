import { Payment, columns } from "../components/vetnure-table/columns"
import { DataTable } from "../components/vetnure-table"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Icons } from "@/components/icons"
import redirects from "@/lib/config/redirects"
import { faker } from '@faker-js/faker'; // Add this import

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  const payments: Payment[] = Array.from({ length: 1000 }, () => ({
    id: faker.string.uuid(), // Generate a unique ID
    amount: faker.number.int({ min: 1, max: 1000 }), // Generate a random amount
    status: faker.helpers.arrayElement(["pending", "processing", "success", "failed"]), // Ensure status matches Payment type
    email: faker.internet.email(), // Generate a random email
  }));

  return payments; // Return the generated payments
}

export default async function VenturePage() {
  const data = await getData()

  return (
    <div className="flex flex-col gap-4 w-full h-full max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Ventures</h1>
        <Link className={cn(buttonVariants({ variant: "secondary" }), "flex items-center gap-2")} href={redirects.app.ventures.create}>
          <Icons.add className="size-5" />
          <span className="hidden md:inline">
            Create Venture
          </span>
        </Link>
      </div>
      <div className="flex flex-col gap-4 items-center justify-between w-full h-full">
        <DataTable columns={columns} data={data} />
      </div >
    </div >
  )
}