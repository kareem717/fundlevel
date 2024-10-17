"use client";

import { CreateAccountForm } from "@/components/forms/create-account-form";
import { DialogLayout } from "@/components/layouts/dialog-layout";

export default function CreateAccountDialog() {
  console.log("CreateAccountDialog");
  return (
    <DialogLayout>
      <CreateAccountForm />
    </DialogLayout>
  )
}