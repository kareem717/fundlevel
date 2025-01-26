"use client"

import { LoginForm } from "@/components/auth/login-form"
import { Dialog, DialogTitle, DialogDescription, DialogHeader, DialogContent } from "@repo/ui/components/dialog"
import { useRouter, useSearchParams } from "next/navigation"

export default function LoginModal() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const redirect = searchParams.get('redirect')

  return (
    <Dialog open={true} onOpenChange={() => !open && router.back()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>
            Please login to continue with your investment.
          </DialogDescription>
        </DialogHeader>
        <div className="px-4 pt-4">
          <LoginForm afterOAuthRedirect={redirect ?? undefined} />
        </div>
      </DialogContent>
    </Dialog>
  )
} 