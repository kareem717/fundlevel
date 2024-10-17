"use client";

import LogoutPage from "@/app/(auth)/logout/page";
import { DialogLayout } from "@/components/layouts/dialog-layout";

export default function LogoutDialog() {
  console.log("LogoutDialog");
  return (
    <DialogLayout>
      <LogoutPage />
    </DialogLayout>
  )
}