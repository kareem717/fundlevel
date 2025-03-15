"use client"

import { LoginForm } from "@/components/auth/login-form"
import { Dialog, DialogTitle, DialogDescription, DialogHeader, DialogContent } from "@workspace/ui/components/dialog"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export default function LoginModal() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState<boolean>(true)

  const redirect = searchParams.get('redirect')

  function closeDialog() {
    setOpen(false)
    router.back()
  }

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>
            Please login to continue with your investment.
          </DialogDescription>
        </DialogHeader>
        <div className="px-4 pt-4">
          <LoginForm afterOAuthRedirect={redirect ?? undefined} replacePath />
        </div>
      </DialogContent>
    </Dialog>
  )
} 