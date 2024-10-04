"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CreateRoundForm } from "@/components/app/rounds/forms/create";

export default function CreateRoundDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    router.back();
  }

  return (
    <Dialog
      onOpenChange={handleClose}
      open={open}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a venture</DialogTitle>
          <DialogDescription>
            Create a new round.
          </DialogDescription>
        </DialogHeader>
        <CreateRoundForm
          onSuccess={handleClose}
        />
      </DialogContent>
    </Dialog>
  )
}

