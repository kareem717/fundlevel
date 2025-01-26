"use client"

import { VerifyOTPForm } from "@/components/auth/verify-otp-form"
import { redirects } from "@/lib/config/redirects"
import { Dialog, DialogTitle, DialogDescription, DialogHeader, DialogContent } from "@repo/ui/components/dialog"
import { useRouter } from "next/navigation"

export default function LoginModal() {
  const router = useRouter()

  return (
    <Dialog open={true} onOpenChange={() => !open && router.back()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm OTP</DialogTitle>
          <DialogDescription>
            Please enter the OTP sent to your email to continue with your investment.
          </DialogDescription>
        </DialogHeader>
        <div className="px-4 pt-4">
          <VerifyOTPForm redirectTo={redirects.auth.createAccount} />
        </div>
      </DialogContent>
    </Dialog>
  )
} 