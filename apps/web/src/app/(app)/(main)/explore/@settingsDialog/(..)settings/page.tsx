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
import SettingsPage from "@/app/(app)/settings/page";


export default function SettingsDialog({ params }: { params: { tab: string } }) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  
  const handleClose = () => {
    setOpen(false);
    router.back();
  }
  
  // TODO: the settings page is ssr, resulting to a ugly loading state unlike the other modals
  return (
    <Dialog
      onOpenChange={handleClose}
      open={open}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your settings.
          </DialogDescription>
        </DialogHeader>
        
        <SettingsPage params={{ tab: params.tab }} />
      </DialogContent>
    </Dialog>
  )
}

