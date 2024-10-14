import { notFound } from "next/navigation";
import { getBusinessById } from "@/actions/busineses";
import { getAccount } from "@/actions/auth";
import { cloneElement } from "react";

export default async function BusinessLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const parsedId = parseInt(params.id);
  if (isNaN(parsedId)) {
    throw notFound();
  }

  const business = await getBusinessById(parsedId);
  if (!business) {
    throw notFound();
  }

  const account = await getAccount();
  if (business.data?.business.ownerAccountId !== account?.data?.id) {
    console.log(business);
    console.log(account);

    throw new Error("You are not authorized to access this business");
  }

  return (
    <>
      {children}
    </>
  );
}
