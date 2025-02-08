"use client"

import { VerifyOTPForm } from "@/components/auth/verify-otp-form"
import { redirects } from "@/lib/config/redirects"
import { Dialog, DialogTitle, DialogDescription, DialogHeader, DialogContent } from "@repo/ui/components/dialog"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginModal() {
  const router = useRouter()
  const [open, setOpen] = useState<boolean>(true)

  function closeDialog() {
    setOpen(false)
    router.back()
  }

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm OTP</DialogTitle>
          <DialogDescription>
            Please enter the OTP sent to your email to continue with your investment.
          </DialogDescription>
        </DialogHeader>
        <div className="px-4 pt-4">
          <VerifyOTPForm redirectTo={redirects.auth.createAccount} replacePath />
        </div>
      </DialogContent>
    </Dialog>
  )
} 