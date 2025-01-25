"use client"

import { Dialog, DialogTitle, DialogDescription, DialogHeader, DialogContent } from "@repo/ui/components/dialog"
import { useRouter } from "next/navigation"

export default function LoginModal() {
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
          <DialogTitle>Confirm OTP</DialogTitle>
          <DialogDescription>Please enter the OTP sent to your email to continue with your investment.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
} 