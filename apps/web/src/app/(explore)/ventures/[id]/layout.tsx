import { NavBack } from "@/components/ui/nav-back";

export default function VentureViewLayout({
  children,
}: // modal
{
  children: React.ReactNode;
  // modal: React.ReactNode
}) {
  return <div className="flex flex-col">{children}</div>;
}
