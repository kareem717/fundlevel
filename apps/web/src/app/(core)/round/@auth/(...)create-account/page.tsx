"use client"

import { CreateAccountForm } from "@/components/auth/create-account-form"
import { Dialog, DialogTitle, DialogDescription, DialogHeader, DialogContent } from "@repo/ui/components/dialog"
import { useRouter } from "next/navigation"

export default function CreateAccountModal() {
  const router = useRouter()

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.back()
    }
  }

  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create an Account</DialogTitle>
          <DialogDescription>Please create an account to continue with your investment.</DialogDescription>
        </DialogHeader>
        <CreateAccountForm redirect={undefined} onSuccess={() => router.back()}/>
      </DialogContent>
    </Dialog>
  )
} 