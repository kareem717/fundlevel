import { VentureNav } from "@/components/app/ventures/layout/nav";
import { VentureSideBar } from "@/components/app/ventures/layout/side-bar";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: {
    default: "My Waitlist",
    template: "%s - My Waitlist",
  },
};

export default async function VentureLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { id: any }
}) {
  //try to parse id as a number
  const id = parseInt(params.id);
  if (isNaN(id)) {
    throw notFound();
  }

  return (
    <div className="grid h-screen w-full md:pl-[56px] overflow-hidden">
      <VentureSideBar ventureId={params.id} className="hidden md:block" />
      <div className="flex flex-col flex-1 overflow-hidden">
        <VentureNav ventureId={params.id} />
        <div className="flex-1 overflow-auto px-4 py-10 md:px-8 md:py-8 w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
