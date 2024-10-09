import { Sidebar } from "@/components/app/sidebar"
import { LogoDiv } from "@/components/logo-div";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Context } from "./components/business-context";
export default async function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full h-full flex flex-col">
      <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 fixed w-full">
        <Sidebar />
        <Context />
      </header>
      <div className="overflow-y-auto mt-14">
        <ScrollArea className="h-full w-full flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </ScrollArea>
      </div>
    </div>
  );
}
