import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default async function VentureRoundsPage({ params }: { params: { id: string } }) {

  return (
    <div className="p-4 space-y-4">
      <Link
        href={`/my-ventures/${params.id}/rounds/fixed-total`}
        className={buttonVariants({ variant: "outline" })}
      >
        Fixed Total
      </Link>
      <Link
        href={`/my-ventures/${params.id}/rounds/partial-total`}
        className={buttonVariants({ variant: "outline" })}
      >
        Partial Total
      </Link>
      <Link
        href={`/my-ventures/${params.id}/rounds/regular-dynamic`}
        className={buttonVariants({ variant: "outline" })}
      >
        Regular Dynamic
      </Link>
      <Link
        href={`/my-ventures/${params.id}/rounds/dutch-dynamic`}
        className={buttonVariants({ variant: "outline" })}
      >
        Dutch Auction
      </Link>
    </div>
  )
}