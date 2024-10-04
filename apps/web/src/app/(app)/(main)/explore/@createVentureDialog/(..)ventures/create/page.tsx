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
import { CreateVentureForm } from "@/components/app/ventures/create-venture-form";

export default function CreateVentureDialog() {
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
            Create a new venture.
          </DialogDescription>
        </DialogHeader>
        <CreateVentureForm
          onSuccess={handleClose}
        />
      </DialogContent>
    </Dialog>
  )
}

