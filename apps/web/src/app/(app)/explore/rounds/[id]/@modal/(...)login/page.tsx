"use client";

import { LoginForm } from "@/components/forms/login-form";
import { DialogLayout } from "@/components/layouts/dialog-layout";

export default function LoginDialog() {
  console.log("LoginDialog");
  return (
    <DialogLayout>
      <LoginForm />
    </DialogLayout>
  )
}