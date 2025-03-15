"use client";

import { CreateAccountForm } from "@/components/auth/create-account-form";
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogContent,
} from "@workspace/ui/components/dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateAccountModal() {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(true);

  function closeDialog() {
    setOpen(false);
    router.back();
  }

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create an Account</DialogTitle>
          <DialogDescription>
            Please create an account to continue with your investment.
          </DialogDescription>
        </DialogHeader>
        <div className="px-4 pt-4">
          <CreateAccountForm redirect={undefined} onSuccess={closeDialog} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
