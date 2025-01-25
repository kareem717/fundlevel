"use client"

import { CreateAccountForm } from "@/components/auth/create-account-form"
import { Dialog, DialogTitle, DialogDescription, DialogHeader, DialogContent } from "@repo/ui/components/dialog"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CreateAccountModal() {
  const router = useRouter()
  const [open, setOpen] = useState(true)

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.back()
    }

    setOpen(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create an Account</DialogTitle>
          <DialogDescription>Please create an account to continue with your investment.</DialogDescription>
        </DialogHeader>
        <CreateAccountForm redirect={undefined} onSuccess={() => setOpen(false)}/>
      </DialogContent>
    </Dialog>
  )
} 