import { NavBack } from "@/components/app/nav-back";
import { LogoDiv } from "@/components/logo-div";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "My Waitlist",
    template: "%s - My Waitlist",
  },
};

export default async function WaitlistLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { id: string }
}) {
  return (
    <div className="grid h-screen w-full overflow-hidden">
      <div className="flex flex-col flex-1 overflow-hidden py-4 justify-center items-start gap-2 sm:gap-4">
        <div className="flex flex-col items-start w-full sm:gap-2 px-2 sm:px-4 md:px-8">
          <LogoDiv />
          <NavBack className="px-0" />
        </div>
        <div className="flex-1 overflow-auto px-4 md:px-8 md:py-8 w-full">
          <div className="max-w-screen-lg mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
